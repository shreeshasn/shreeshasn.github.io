import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { usePortfolio } from '../context/PortfolioContext';
import type { Skill } from '../context/PortfolioContext';
import { playSynthSound } from '../utils/audio';

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  description: string;
  proficiencyLevel: string;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
}

export const SkillGraph: React.FC = () => {
  const { skills, getProjectsBySkill, isSoundEnabled, isDarkMode, setSelectedProjectId } = usePortfolio();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [graphScale] = useState(1.0);

  // Smoothly update the D3 transform when the slider scale changes without resetting simulation
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || !containerRef.current) return;
    
    const width = containerRef.current.getBoundingClientRect().width || 800;
    const height = 580;
    
    d3.select(svgElement)
      .select('.main-zoom-group')
      .transition()
      .duration(250)
      .ease(d3.easeCubicOut)
      .attr('transform', `translate(${width / 2 * (1 - graphScale)}, ${height / 2 * (1 - graphScale)}) scale(${graphScale})`);
  }, [graphScale]);

  useEffect(() => {
    const svgElement = svgRef.current;
    const container = containerRef.current;
    if (!svgElement || !container) return;

    // Clear previous drawing
    d3.select(svgElement).selectAll('*').remove();

    const rect = container.getBoundingClientRect();
    const width = rect.width || 800;
    const height = 580;

    // Get color tokens dynamically from custom properties
    const style = getComputedStyle(document.documentElement);
    const colorInk = style.getPropertyValue('--color-ink').trim() || '#201d1d';
    const colorMute = style.getPropertyValue('--color-mute').trim() || '#646262';
    const colorCard = style.getPropertyValue('--color-surface-card').trim() || '#f1eeee';
    const colorStrongHairline = style.getPropertyValue('--color-hairline-strong').trim() || '#646262';
    const colorSoftSurface = style.getPropertyValue('--color-surface-soft').trim() || '#f8f7f7';

    // Prepare Node data - Start closely packed around the center instead of randomly spread
    const nodesData: D3Node[] = skills.map(s => ({
      id: s.id,
      name: s.name,
      proficiency: s.proficiency,
      category: s.category,
      description: s.description,
      proficiencyLevel: s.proficiencyLevel,
      x: width / 2 + (Math.random() - 0.5) * 80,
      y: height / 2 + (Math.random() - 0.5) * 80
    }));

    // Prepare Link data
    const linksData: D3Link[] = [];
    skills.forEach(skill => {
      if (skill.relatedSkills) {
        skill.relatedSkills.forEach(relId => {
          // Verify nodes exist
          const sourceExists = nodesData.some(n => n.id === skill.id);
          const targetExists = nodesData.some(n => n.id === relId);
          if (sourceExists && targetExists) {
            // Check for double edges
            const alreadyExists = linksData.some(l => 
              (l.source === skill.id && l.target === relId) || 
              (l.source === relId && l.target === skill.id)
            );
            if (!alreadyExists) {
              linksData.push({
                source: skill.id,
                target: relId
              });
            }
          }
        });
      }
    });

    const svg = d3.select(svgElement)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Master group with a class for transition scales centered in container
    const g = svg.append('g')
      .attr('class', 'main-zoom-group')
      .attr('transform', `translate(${width / 2 * (1 - graphScale)}, ${height / 2 * (1 - graphScale)}) scale(${graphScale})`);

    // Force simulation - Milder repulsion and stronger pull towards visual center
    const simulation = d3.forceSimulation<D3Node>(nodesData)
      .velocityDecay(0.32) // Damps the movement to prevent bouncing around
      .force('link', d3.forceLink<D3Node, D3Link>(linksData).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300)) // balanced repulsive force to spread out nodes
      .force('x', d3.forceX(width / 2).strength(0.06))   // weaker pull clusters towards the center X to prevent blobiness
      .force('y', d3.forceY(height / 2).strength(0.06))   // weaker pull clusters towards the center Y to prevent blobiness
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<D3Node>().radius(d => getRadius(d.name, d.proficiency) + 10)); // tighter collision boundaries

    // Render Edges - Dynamic visible lines in light mode (rgba(15,0,0,0.25)) and dark mode (rgba(253,252,252,0.25))
    const link = g.append('g')
      .selectAll('line')
      .data(linksData)
      .enter()
      .append('line')
      .attr('stroke-width', 1)
      .attr('stroke', isDarkMode ? 'rgba(253, 252, 252, 0.25)' : 'rgba(15, 0, 0, 0.25)')
      .attr('stroke-dasharray', '2, 2');

    // Render Node Containers (groups)
    const node = g.append('g')
      .selectAll('.node')
      .data(nodesData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.25s ease')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Dynamic radius mapping based on proficiency to visually highlight stronger skills
    function getRadius(name: string, proficiency: number) {
      // Spans from 16px up to 42px based on user proficiency percentage
      const baseRadius = 16 + (proficiency / 100) * 26;
      // Scaling for text length bounds to prevent overflows
      return name.length > 8 ? Math.max(baseRadius, name.length * 3.8) : baseRadius;
    }

    // Node circles
    node.append('circle')
      .attr('r', d => getRadius(d.name, d.proficiency))
      .attr('fill', colorCard)
      .attr('stroke', colorStrongHairline)
      .attr('stroke-width', 1)
      .attr('class', 'node-circle');

    // Label Text - Scale font size down for long words (JavaScript/PostgreSQL) to avoid cut-offs
    node.append('text')
      .attr('dy', '-2px')
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', d => d.name.length > 8 ? '0.625rem' : '0.75rem')
      .style('font-weight', '700')
      .style('fill', colorInk)
      .text(d => d.name);

    // Percentage Caption
    node.append('text')
      .attr('dy', '12px')
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.625rem')
      .style('fill', colorMute)
      .text(d => `${d.proficiency}%`);

    // Interactive Hover & Click Effects
    node.on('mouseover', function(_, d) {
      playSynthSound('tap', isSoundEnabled);

      // Determine connected node IDs in a robust way via link references and related skills
      const relatedIds = skills.find(s => s.id === d.id)?.relatedSkills || [];
      const connectedNodeIds = new Set<string>([d.id, ...relatedIds]);
      linksData.forEach(l => {
        const sourceId = (typeof l.source === 'object') ? (l.source as D3Node).id : l.source;
        const targetId = (typeof l.target === 'object') ? (l.target as D3Node).id : l.target;
        if (sourceId === d.id) {
          connectedNodeIds.add(targetId);
        } else if (targetId === d.id) {
          connectedNodeIds.add(sourceId);
        }
      });

      // Highlight connections: only show links connected to the hovered node, hide others completely
      link
        .attr('stroke', l => {
          const sourceId = (typeof l.source === 'object') ? (l.source as D3Node).id : l.source;
          const targetId = (typeof l.target === 'object') ? (l.target as D3Node).id : l.target;
          if (sourceId === d.id || targetId === d.id) return colorInk;
          return 'transparent';
        })
        .attr('stroke-width', l => {
          const sourceId = (typeof l.source === 'object') ? (l.source as D3Node).id : l.source;
          const targetId = (typeof l.target === 'object') ? (l.target as D3Node).id : l.target;
          return (sourceId === d.id || targetId === d.id) ? 2 : 0;
        });

      // Highlight groups: make other node groups (including circles + text labels) almost fully invisible (opacity 0.02)
      // Set inline style for guaranteed browser specificity
      d3.selectAll<SVGGElement, D3Node>('.node')
        .style('opacity', n => connectedNodeIds.has(n.id) ? '1' : '0.02');

      // Highlight circles style
      d3.selectAll<SVGCircleElement, D3Node>('.node-circle')
        .attr('fill', n => n.id === d.id ? colorSoftSurface : colorCard)
        .attr('stroke', n => n.id === d.id ? colorInk : colorStrongHairline);
      
      // Update selected skill details in state
      const actualSkill = skills.find(s => s.id === d.id);
      if (actualSkill) setSelectedSkill(actualSkill);
    });

    node.on('mouseout', function() {
      // Restore defaults for links
      link
        .attr('stroke', isDarkMode ? 'rgba(253, 252, 252, 0.25)' : 'rgba(15, 0, 0, 0.25)')
        .attr('stroke-width', 1);

      // Restore opacity for all node groups
      d3.selectAll('.node')
        .style('opacity', '1');

      // Restore circle color styling
      d3.selectAll('.node-circle')
        .attr('fill', colorCard)
        .attr('stroke', colorStrongHairline);
    });


    // Update on tick
    simulation.on('tick', () => {
      // Constrain coordinates to stay strictly inside graph boundary margin padding
      // Keep x offset at least 40px to stay clear of the left-aligned dial strip!
      nodesData.forEach(d => {
        const radius = getRadius(d.name, d.proficiency);
        d.x = Math.max(40 + radius + 15, Math.min(width - radius - 15, d.x || 0));
        d.y = Math.max(radius + 15, Math.min(height - radius - 15, d.y || 0));
      });

      link
        .attr('x1', d => (d.source as D3Node).x || 0)
        .attr('y1', d => (d.source as D3Node).y || 0)
        .attr('x2', d => (d.target as D3Node).x || 0)
        .attr('y2', d => (d.target as D3Node).y || 0);

      node
        .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    // Drag handlers
    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [skills, isDarkMode, isSoundEnabled, getProjectsBySkill, graphScale, setSelectedProjectId]);

  const handleProjectClick = (projectId: string) => {
    playSynthSound('click', isSoundEnabled);
    setSelectedProjectId(projectId);
    const element = document.getElementById(`project-card-${projectId}`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 76,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="skills" className="content-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-canvas)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>
          [+] Skills &amp; Technology Graph
        </h2>
        <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 'var(--spacing-xs) 0 0 0' }}>
          // Hover on nodes to inspect connections and proficiency level. Drag to reorganize. Click to sync project.
        </p>
      </div>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: 'var(--spacing-xl)'
        }}
        className="skills-grid"
      >
        {/* Dynamic D3 SVG Container */}
        <div 
          ref={containerRef}
          className="hairline-border"
          style={{
            width: '100%',
            backgroundColor: 'var(--color-surface-soft)',
            borderRadius: 'var(--rounded-none)',
            position: 'relative',
            overflow: 'hidden',
            touchAction: 'none'
          }}
          onMouseLeave={() => setSelectedSkill(null)}
        >
          <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />

          {/* Subtle Dynamic Monochrome Left-Side Resize Dial */}
          {/* 
          <div 
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '40px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px 0',
              backgroundColor: isDarkMode ? 'rgba(26, 23, 23, 0.85)' : 'rgba(248, 247, 247, 0.85)',
              borderRight: '1px solid var(--color-hairline)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              userSelect: 'none',
              backdropFilter: 'blur(4px)'
            }}
          >
            <span style={{ fontSize: '0.45rem', opacity: 0.7, fontWeight: 700, letterSpacing: '0.5px', transform: 'rotate(-90deg)', margin: '12px 0' }}>ZOOM_SYS</span>
            
            <div 
              style={{
                position: 'relative',
                width: '18px',
                height: '180px',
                backgroundColor: isDarkMode ? '#1a1717' : '#e8e5e5',
                border: '1px solid var(--color-hairline)',
                cursor: 'ns-resize',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              title="Drag up/down or scroll here to resize graph"
              onWheel={(e) => {
                e.preventDefault();
                const change = e.deltaY < 0 ? 0.05 : -0.05;
                setGraphScale(prev => Math.min(1.5, Math.max(0.4, prev + change)));
                playSynthSound('tap', isSoundEnabled);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                const startScale = graphScale;
                
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const deltaY = startY - moveEvent.clientY; // move up -> scale up
                  const scaleDiff = (deltaY / 180) * 0.8;
                  setGraphScale(Math.min(1.5, Math.max(0.4, startScale + scaleDiff)));
                  if (Math.abs(deltaY) % 6 === 0) {
                    playSynthSound('tap', isSoundEnabled);
                  }
                };
                
                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                };
                
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)' }}></div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)', opacity: 0.5 }}></div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)', opacity: 0.3 }}></div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)', opacity: 0.3 }}></div>
              
              <div 
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'var(--color-ink)',
                  transform: `translateY(${(1.0 - (graphScale - 0.4) / 1.1) * 140 - 70}px)`,
                  transition: 'transform 0.1s ease',
                  borderTop: '1px solid var(--color-canvas)',
                  borderBottom: '1px solid var(--color-canvas)'
                }}
              ></div>
              
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)', opacity: 0.3 }}></div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)', opacity: 0.3 }}></div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)', opacity: 0.5 }}></div>
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-hairline)' }}></div>
            </div>
            
            <div style={{ fontSize: '0.55rem', fontWeight: 'bold' }}>
              {Math.round(graphScale * 100)}%
            </div>
          </div>
          */}
        </div>

        {/* Dynamic Inspector Panel */}
        <div 
          className="hairline-border"
          style={{
            padding: 'var(--spacing-xl)',
            backgroundColor: 'var(--color-surface-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>
            SELECTED NODE // INSPECTOR
          </div>

          {selectedSkill ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <h3 className="heading-md" style={{ color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span>{selectedSkill.icon}</span>
                  <span>{selectedSkill.name.toUpperCase()}</span>
                </h3>
                <span className="caption-md" style={{ color: 'var(--color-mute)' }}>
                  Category: {selectedSkill.category.toUpperCase()} | Proficiency: {selectedSkill.proficiencyLevel}
                </span>
              </div>

              <div 
                style={{
                  height: '4px',
                  width: '100%',
                  backgroundColor: 'var(--color-surface-card)',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    height: '100%',
                    width: `${selectedSkill.proficiency}%`,
                    backgroundColor: 'var(--color-ink)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <p className="body-md" style={{ color: 'var(--color-body)' }}>
                {selectedSkill.description}
              </p>

              {/* Connected projects in database */}
              {getProjectsBySkill(selectedSkill.id).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>RELATED PROJECTS //</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                    {getProjectsBySkill(selectedSkill.id).map(proj => (
                      <span 
                        key={proj.id}
                        onClick={() => handleProjectClick(proj.id)}
                        className="badge-news"
                        style={{ cursor: 'pointer' }}
                        title="Click to view details"
                      >
                        [→] {proj.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ash)', minHeight: '140px' }}>
              <p className="body-md">// Hover over any node in the graph above to load details</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 851px) {
          .skills-grid {
            grid-template-columns: 3fr 2fr !important;
          }
        }
      `}</style>
    </section>
  );
};
