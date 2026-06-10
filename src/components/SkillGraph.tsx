import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { usePortfolio } from '../context/PortfolioContext';
import type { Skill } from '../context/PortfolioContext';
import { playSynthSound } from '../utils/audio';
import { SKILL_TO_CLUSTER } from '../utils/skills';

// ─── Cluster Definitions ──────────────────────────────────────────────
// Maps skill categories to human-readable cluster labels
const CLUSTER_CONFIG: Record<string, { label: string; order: number }> = {
  'core-competencies': { label: 'Core Competencies',  order: 0 },
  languages:           { label: 'Languages',          order: 1 },
  frameworks:          { label: 'Frameworks',         order: 2 },
  'ai-ml':             { label: 'AI / ML',            order: 3 },
  'data-viz':          { label: 'Data & Viz',         order: 4 },
  devops:              { label: 'DevOps',             order: 5 },
  databases:           { label: 'Databases',          order: 6 },
  architecture:        { label: 'Architecture',       order: 7 },
  'platforms-tools':   { label: 'Platforms and Tools', order: 8 },
};

// ─── D3 Node Types ────────────────────────────────────────────────────
interface ClusterNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  childCount: number;
  avgProficiency: number;
}

interface SkillNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  description: string;
  proficiencyLevel: string;
}

interface D3Link extends d3.SimulationLinkDatum<SkillNode> {
  source: string | SkillNode;
  target: string | SkillNode;
}

// ─── Component ────────────────────────────────────────────────────────
export const SkillGraph: React.FC = () => {
  const { skills, getProjectsBySkill, isSoundEnabled, isDarkMode, setSelectedProjectId } = usePortfolio();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simulationRef = useRef<d3.Simulation<SkillNode | ClusterNode, D3Link> | null>(null);

  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [clusterSummary, setClusterSummary] = useState<{ label: string; count: number; avgProf: number } | null>(null);

  // Group skills by cluster
  const skillsByCluster = useCallback(() => {
    const groups: Record<string, Skill[]> = {};
    skills.forEach(s => {
      if (s.hideFromPublic) return;
      const cat = SKILL_TO_CLUSTER[s.id] || 'languages';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [skills]);

  // Navigate back to cluster view
  const handleBack = useCallback(() => {
    playSynthSound('click', isSoundEnabled);
    setActiveCluster(null);
    setSelectedSkill(null);
    setClusterSummary(null);
  }, [isSoundEnabled]);

  // ─── LEVEL 1: Cluster Nodes ───────────────────────────────────────
  useEffect(() => {
    if (activeCluster !== null) return;

    const svgElement = svgRef.current;
    const container = containerRef.current;
    if (!svgElement || !container) return;

    // Cleanup
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }
    d3.select(svgElement).selectAll('*').remove();
    setSelectedSkill(null);
    setClusterSummary(null);

    const rect = container.getBoundingClientRect();
    const width = rect.width || 800;
    const height = 580;

    // Color tokens
    const style = getComputedStyle(document.documentElement);
    const colorInk = style.getPropertyValue('--color-ink').trim() || '#201d1d';
    const colorMute = style.getPropertyValue('--color-mute').trim() || '#646262';
    const colorCard = style.getPropertyValue('--color-surface-card').trim() || '#f1eeee';
    const colorStrongHairline = style.getPropertyValue('--color-hairline-strong').trim() || '#646262';
    const colorSoftSurface = style.getPropertyValue('--color-surface-soft').trim() || '#f8f7f7';

    const groups = skillsByCluster();

    // Build cluster nodes
    const clusterNodes: ClusterNode[] = Object.entries(groups)
      .map(([cat, items]) => {
        const config = CLUSTER_CONFIG[cat] || { label: cat.toUpperCase(), order: 99 };
        const avgProf = Math.round(items.reduce((sum, s) => sum + s.proficiency, 0) / items.length);
        return {
          id: `cluster-${cat}`,
          label: config.label,
          category: cat,
          childCount: items.length,
          avgProficiency: avgProf,
          x: width / 2 + (Math.random() - 0.5) * 60,
          y: height / 2 + (Math.random() - 0.5) * 60,
        };
      })
      .sort((a, b) => {
        const orderA = CLUSTER_CONFIG[a.category]?.order ?? 99;
        const orderB = CLUSTER_CONFIG[b.category]?.order ?? 99;
        return orderA - orderB;
      });

    // Build inter-cluster links based on cross-category relatedSkills
    const clusterLinks: d3.SimulationLinkDatum<ClusterNode>[] = [];
    const categoryPairs = new Set<string>();
    skills.forEach(s => {
      if (s.hideFromPublic) return;
      const clusterA = SKILL_TO_CLUSTER[s.id] || 'languages';
      (s.relatedSkills || []).forEach(relId => {
        const related = skills.find(sk => sk.id === relId);
        if (related) {
          const clusterB = SKILL_TO_CLUSTER[relId] || 'languages';
          if (clusterA !== clusterB) {
            const pairKey = [clusterA, clusterB].sort().join('-');
            if (!categoryPairs.has(pairKey)) {
              categoryPairs.add(pairKey);
              const sourceNode = clusterNodes.find(c => c.category === clusterA);
              const targetNode = clusterNodes.find(c => c.category === clusterB);
              if (sourceNode && targetNode) {
                clusterLinks.push({ source: sourceNode.id, target: targetNode.id });
              }
            }
          }
        }
      });
    });

    const svg = d3.select(svgElement)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('class', 'main-zoom-group');

    // Cluster radius: larger than skill nodes
    function clusterRadius(node: ClusterNode): number {
      return 35 + (node.childCount * 2);
    }

    // Force simulation for clusters
    const simulation = d3.forceSimulation<ClusterNode>(clusterNodes)
      .velocityDecay(0.35)
      .force('link', d3.forceLink<ClusterNode, d3.SimulationLinkDatum<ClusterNode>>(clusterLinks).id(d => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(width / 2).strength(0.08))
      .force('y', d3.forceY(height / 2).strength(0.08))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<ClusterNode>().radius(d => {
        const textWidth = d.label.length * 6.5;
        return Math.max(clusterRadius(d) + 10, textWidth / 2 + 15);
      }));

    simulationRef.current = simulation as unknown as d3.Simulation<SkillNode | ClusterNode, D3Link>;

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(clusterLinks)
      .enter()
      .append('line')
      .attr('stroke-width', 1)
      .attr('stroke', isDarkMode ? 'rgba(253, 252, 252, 0.2)' : 'rgba(15, 0, 0, 0.15)')
      .attr('stroke-dasharray', '4, 4');

    // Node groups
    const node = g.append('g')
      .selectAll('.cluster-node')
      .data(clusterNodes)
      .enter()
      .append('g')
      .attr('class', 'cluster-node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, ClusterNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Outer circle
    node.append('circle')
      .attr('r', d => clusterRadius(d))
      .attr('fill', colorCard)
      .attr('stroke', colorStrongHairline)
      .attr('stroke-width', 1.5)
      .attr('class', 'cluster-circle');

    // Label text
    node.append('text')
      .attr('dy', d => -clusterRadius(d) - 6)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.75rem')
      .style('font-weight', '700')
      .style('fill', colorInk)
      .text(d => d.label.toUpperCase());

    // Child count subtitle
    node.append('text')
      .attr('dy', -2)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.65rem')
      .style('font-weight', '500')
      .style('fill', colorMute)
      .text(d => `${d.childCount} skills`);

    // Avg proficiency indicator
    node.append('text')
      .attr('dy', 10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.55rem')
      .style('fill', colorMute)
      .text(d => `avg ${d.avgProficiency}%`);

    // Hover interactions
    node.on('mouseover', function(_, d) {
      playSynthSound('tap', isSoundEnabled);

      // Determine connected clusters
      const connectedClusterIds = new Set<string>([d.id]);
      clusterLinks.forEach(l => {
        const sourceId = (typeof l.source === 'object') ? (l.source as ClusterNode).id : String(l.source);
        const targetId = (typeof l.target === 'object') ? (l.target as ClusterNode).id : String(l.target);
        if (sourceId === d.id) connectedClusterIds.add(targetId);
        else if (targetId === d.id) connectedClusterIds.add(sourceId);
      });

      // Fade non-connected clusters
      d3.selectAll<SVGGElement, ClusterNode>('.cluster-node')
        .style('opacity', n => connectedClusterIds.has(n.id) ? '1' : '0.05')
        .style('pointer-events', n => connectedClusterIds.has(n.id) ? 'auto' : 'none');

      // Highlight connected links
      link
        .attr('stroke', l => {
          const sourceId = (typeof l.source === 'object') ? (l.source as ClusterNode).id : l.source;
          const targetId = (typeof l.target === 'object') ? (l.target as ClusterNode).id : l.target;
          if (sourceId === d.id || targetId === d.id) return colorInk;
          return 'transparent';
        })
        .attr('stroke-width', l => {
          const sourceId = (typeof l.source === 'object') ? (l.source as ClusterNode).id : l.source;
          const targetId = (typeof l.target === 'object') ? (l.target as ClusterNode).id : l.target;
          return (sourceId === d.id || targetId === d.id) ? 2 : 0;
        });

      // Highlight hovered circle
      d3.selectAll<SVGCircleElement, ClusterNode>('.cluster-circle')
        .attr('fill', n => n.id === d.id ? colorSoftSurface : colorCard)
        .attr('stroke', n => n.id === d.id ? colorInk : colorStrongHairline);

      // Show cluster summary in inspector
      setClusterSummary({
        label: d.label,
        count: d.childCount,
        avgProf: d.avgProficiency,
      });
      setSelectedSkill(null);
    });

    node.on('mouseout', function() {
      d3.selectAll('.cluster-node')
        .style('opacity', '1')
        .style('pointer-events', 'auto');
      link
        .attr('stroke', isDarkMode ? 'rgba(253, 252, 252, 0.2)' : 'rgba(15, 0, 0, 0.15)')
        .attr('stroke-width', 1);
      d3.selectAll('.cluster-circle')
        .attr('fill', colorCard)
        .attr('stroke', colorStrongHairline);
    });

    // Click to drill down — with drag distance threshold for mobile
    let dragStartPos: { x: number; y: number } | null = null;
    node.on('mousedown', function(event) {
      dragStartPos = { x: event.clientX, y: event.clientY };
    });
    node.on('click', function(event, d) {
      if (dragStartPos) {
        const dist = Math.sqrt(
          Math.pow(event.clientX - dragStartPos.x, 2) +
          Math.pow(event.clientY - dragStartPos.y, 2)
        );
        if (dist > 5) return; // Was a drag, not a click
      }
      playSynthSound('click', isSoundEnabled);
      setActiveCluster(d.category);
    });

    // Tick update
    simulation.on('tick', () => {
      clusterNodes.forEach(d => {
        const r = clusterRadius(d);
        const textWidth = d.label.length * 6.5;
        const xPad = Math.max(textWidth / 2 + 15, r + 15);
        d.x = Math.max(xPad, Math.min(width - xPad, d.x || 0));
        d.y = Math.max(r + 25, Math.min(height - r - 25, d.y || 0));
      });

      link
        .attr('x1', d => (d.source as ClusterNode).x || 0)
        .attr('y1', d => (d.source as ClusterNode).y || 0)
        .attr('x2', d => (d.target as ClusterNode).x || 0)
        .attr('y2', d => (d.target as ClusterNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [activeCluster, skills, isDarkMode, isSoundEnabled, skillsByCluster]);


  // ─── LEVEL 2: Skill Nodes (Drill-Down) ────────────────────────────
  useEffect(() => {
    if (activeCluster === null) return;

    const svgElement = svgRef.current;
    const container = containerRef.current;
    if (!svgElement || !container) return;

    // Cleanup
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }
    d3.select(svgElement).selectAll('*').remove();
    setClusterSummary(null);

    const rect = container.getBoundingClientRect();
    const width = rect.width || 800;
    const height = 580;

    // Color tokens
    const style = getComputedStyle(document.documentElement);
    const colorInk = style.getPropertyValue('--color-ink').trim() || '#201d1d';
    const colorMute = style.getPropertyValue('--color-mute').trim() || '#646262';
    const colorCard = style.getPropertyValue('--color-surface-card').trim() || '#f1eeee';
    const colorStrongHairline = style.getPropertyValue('--color-hairline-strong').trim() || '#646262';
    const colorSoftSurface = style.getPropertyValue('--color-surface-soft').trim() || '#f8f7f7';

    // Filter main skills for this cluster
    const mainSkills = skills.filter(s => !s.hideFromPublic && (SKILL_TO_CLUSTER[s.id] || 'languages') === activeCluster);
    const mainIds = new Set(mainSkills.map(s => s.id));

    // Find secondary skills connected to main skills
    const secondaryIds = new Set<string>();
    mainSkills.forEach(s => {
      (s.relatedSkills || []).forEach(relId => {
        if (!mainIds.has(relId)) {
          secondaryIds.add(relId);
        }
      });
    });

    const secondarySkills = skills.filter(s => !s.hideFromPublic && secondaryIds.has(s.id));

    interface SkillNodeWithRole extends SkillNode {
      isSecondary?: boolean;
    }

    // Build combined nodes list — pre-positioned at center for smooth fan-out
    const nodesData: SkillNodeWithRole[] = [
      ...mainSkills.map(s => ({
        id: s.id,
        name: s.name,
        proficiency: s.proficiency,
        category: s.category,
        description: s.description,
        proficiencyLevel: s.proficiencyLevel,
        isSecondary: false,
        x: width / 2 + (Math.random() - 0.5) * 40,
        y: height / 2 + (Math.random() - 0.5) * 40,
      })),
      ...secondarySkills.map(s => ({
        id: s.id,
        name: s.name,
        proficiency: s.proficiency,
        category: s.category,
        description: s.description,
        proficiencyLevel: s.proficiencyLevel,
        isSecondary: true,
        x: width / 2 + (Math.random() - 0.5) * 80,
        y: height / 2 + (Math.random() - 0.5) * 80,
      }))
    ];

    // Build intra-cluster and secondary links
    const linksData: D3Link[] = [];
    nodesData.forEach(nodeA => {
      const actualSkill = skills.find(s => s.id === nodeA.id);
      if (!actualSkill) return;
      (actualSkill.relatedSkills || []).forEach(relId => {
        const targetNode = nodesData.find(n => n.id === relId);
        if (targetNode) {
          const alreadyExists = linksData.some(l =>
            (l.source === nodeA.id && l.target === relId) ||
            (l.source === relId && l.target === nodeA.id)
          );
          if (!alreadyExists) {
            linksData.push({ source: nodeA.id, target: relId });
          }
        }
      });
    });

    // Ensure all main nodes are connected to at least one other main node in the cluster
    mainSkills.forEach(s => {
      const hasIntraConnection = linksData.some(l => {
        const src = (typeof l.source === 'object') ? (l.source as SkillNodeWithRole).id : l.source;
        const tgt = (typeof l.target === 'object') ? (l.target as SkillNodeWithRole).id : l.target;
        return (src === s.id && mainIds.has(tgt as string)) || (tgt === s.id && mainIds.has(src as string));
      });

      if (!hasIntraConnection && mainSkills.length > 1) {
        let closestNode: Skill | null = null;
        let minDiff = Infinity;
        
        mainSkills.forEach(other => {
          if (other.id === s.id) return;
          const diff = Math.abs(other.proficiency - s.proficiency);
          if (diff < minDiff) {
            minDiff = diff;
            closestNode = other;
          }
        });

        if (closestNode) {
          linksData.push({ source: s.id, target: (closestNode as Skill).id });
        }
      }
    });

    const svg = d3.select(svgElement)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('class', 'main-zoom-group');

    function getRadius(d: SkillNodeWithRole): number {
      if (d.isSecondary) {
        return 12 + (d.proficiency / 100) * 4;
      }
      return 18 + (d.proficiency / 100) * 6;
    }

    // Force simulation — gentler alpha for smooth expansion
    const simulation = d3.forceSimulation<SkillNodeWithRole>(nodesData)
      .alpha(0.5) // Lower than default 1.0 to prevent explosion
      .velocityDecay(0.4)
      .force('link', d3.forceLink<SkillNodeWithRole, D3Link>(linksData).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('x', d3.forceX(width / 2).strength(0.08))
      .force('y', d3.forceY(height / 2).strength(0.08))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<SkillNodeWithRole>().radius(d => {
        const textWidth = d.name.length * 6;
        return Math.max(getRadius(d) + 8, textWidth / 2 + 10);
      }));

    simulationRef.current = simulation as unknown as d3.Simulation<SkillNode | ClusterNode, D3Link>;

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(linksData)
      .enter()
      .append('line')
      .attr('stroke-width', 1)
      .attr('stroke', isDarkMode ? 'rgba(253, 252, 252, 0.25)' : 'rgba(15, 0, 0, 0.25)')
      .attr('stroke-dasharray', '2, 2')
      .style('opacity', 0);

    // Animate links in (only main-to-main links shown by default at 0.25)
    link.transition().delay(200).duration(300).style('opacity', l => {
      const sourceNode = nodesData.find(n => n.id === ((typeof l.source === 'object') ? (l.source as SkillNodeWithRole).id : l.source));
      const targetNode = nodesData.find(n => n.id === ((typeof l.target === 'object') ? (l.target as SkillNodeWithRole).id : l.target));
      if (sourceNode && targetNode && !sourceNode.isSecondary && !targetNode.isSecondary) {
        return 0.25;
      }
      return 0;
    });

    // Node groups
    const node = g.append('g')
      .selectAll('.node')
      .data(nodesData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .style('pointer-events', d => d.isSecondary ? 'none' : 'auto')
      .call(d3.drag<SVGGElement, SkillNodeWithRole>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Staggered fan-out animation
    node.transition()
      .delay((_, i) => 50 + i * 40)
      .duration(300)
      .style('opacity', d => d.isSecondary ? 0 : 1);

    // Node circles
    node.append('circle')
      .attr('r', d => getRadius(d))
      .attr('fill', colorCard)
      .attr('stroke', colorStrongHairline)
      .attr('stroke-width', d => d.isSecondary ? 1 : 1.5)
      .attr('stroke-dasharray', d => d.isSecondary ? '3, 3' : 'none')
      .attr('class', 'node-circle');

    // Label text
    node.append('text')
      .attr('dy', d => -getRadius(d) - 6)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', d => d.isSecondary ? '0.55rem' : '0.7rem')
      .style('font-weight', d => d.isSecondary ? '400' : '700')
      .style('fill', colorInk)
      .text(d => d.name);

    // Percentage caption
    node.append('text')
      .attr('dy', 3)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.55rem')
      .style('fill', colorMute)
      .text(d => `${d.proficiency}%`);

    // Hover interactions
    node.on('mouseover', function(_, d) {
      if (d.isSecondary) return; // Only trigger hover interactions for main skills

      playSynthSound('tap', isSoundEnabled);

      // Determine connected nodes
      const relatedIds = skills.find(s => s.id === d.id)?.relatedSkills || [];
      const connectedNodeIds = new Set<string>([d.id, ...relatedIds]);
      linksData.forEach(l => {
        const sourceId = (typeof l.source === 'object') ? (l.source as SkillNodeWithRole).id : l.source;
        const targetId = (typeof l.target === 'object') ? (l.target as SkillNodeWithRole).id : l.target;
        if (sourceId === d.id) connectedNodeIds.add(targetId);
        else if (targetId === d.id) connectedNodeIds.add(sourceId);
      });

      // Highlight connections
      link
        .style('opacity', l => {
          const sourceId = (typeof l.source === 'object') ? (l.source as SkillNodeWithRole).id : l.source;
          const targetId = (typeof l.target === 'object') ? (l.target as SkillNodeWithRole).id : l.target;
          return (sourceId === d.id || targetId === d.id) ? 1 : 0;
        })
        .attr('stroke', l => {
          const sourceId = (typeof l.source === 'object') ? (l.source as SkillNodeWithRole).id : l.source;
          const targetId = (typeof l.target === 'object') ? (l.target as SkillNodeWithRole).id : l.target;
          if (sourceId === d.id || targetId === d.id) return colorInk;
          return 'transparent';
        })
        .attr('stroke-width', l => {
          const sourceId = (typeof l.source === 'object') ? (l.source as SkillNodeWithRole).id : l.source;
          const targetId = (typeof l.target === 'object') ? (l.target as SkillNodeWithRole).id : l.target;
          return (sourceId === d.id || targetId === d.id) ? 2 : 0;
        });

      // Fade non-connected nodes (including main nodes not connected)
      d3.selectAll<SVGGElement, SkillNodeWithRole>('.node')
        .style('opacity', n => connectedNodeIds.has(n.id) ? '1' : '0.05')
        .style('pointer-events', n => connectedNodeIds.has(n.id) ? 'auto' : 'none');

      // Highlight hovered circle
      d3.selectAll<SVGCircleElement, SkillNodeWithRole>('.node-circle')
        .attr('fill', n => n.id === d.id ? colorSoftSurface : colorCard)
        .attr('stroke', n => n.id === d.id ? colorInk : colorStrongHairline);

      // Update inspector
      const actualSkill = skills.find(s => s.id === d.id);
      if (actualSkill) setSelectedSkill(actualSkill);
    });

    node.on('mouseout', function(_, d) {
      if (d.isSecondary) return;

      link
        .style('opacity', l => {
          const sourceNode = nodesData.find(n => n.id === ((typeof l.source === 'object') ? (l.source as SkillNodeWithRole).id : l.source));
          const targetNode = nodesData.find(n => n.id === ((typeof l.target === 'object') ? (l.target as SkillNodeWithRole).id : l.target));
          if (sourceNode && targetNode && !sourceNode.isSecondary && !targetNode.isSecondary) {
            return 0.25;
          }
          return 0;
        })
        .attr('stroke', isDarkMode ? 'rgba(253, 252, 252, 0.25)' : 'rgba(15, 0, 0, 0.25)')
        .attr('stroke-width', 1);

      d3.selectAll<SVGGElement, SkillNodeWithRole>('.node')
        .style('opacity', n => n.isSecondary ? '0' : '1')
        .style('pointer-events', n => n.isSecondary ? 'none' : 'auto');

      d3.selectAll('.node-circle')
        .attr('fill', colorCard)
        .attr('stroke', colorStrongHairline);
    });

    // Tick
    simulation.on('tick', () => {
      nodesData.forEach(d => {
        const radius = getRadius(d);
        const textWidth = d.name.length * 6;
        const xPad = Math.max(textWidth / 2 + 15, radius + 15);
        d.x = Math.max(xPad, Math.min(width - xPad, d.x || 0));
        d.y = Math.max(radius + 25, Math.min(height - radius - 25, d.y || 0));
      });

      link
        .attr('x1', d => (d.source as SkillNodeWithRole).x || 0)
        .attr('y1', d => (d.source as SkillNodeWithRole).y || 0)
        .attr('x2', d => (d.target as SkillNodeWithRole).x || 0)
        .attr('y2', d => (d.target as SkillNodeWithRole).y || 0);

      node.attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [activeCluster, skills, isDarkMode, isSoundEnabled, getProjectsBySkill, setSelectedProjectId]);


  // ─── Project Click Handler ──────────────────────────────────────────
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


  // ─── Render ─────────────────────────────────────────────────────────
  const clusterLabel = activeCluster
    ? (CLUSTER_CONFIG[activeCluster]?.label || activeCluster.toUpperCase())
    : null;

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
          {activeCluster
            ? `// Viewing ${clusterLabel} — hover to inspect, drag to reorganize.`
            : '// Click on a cluster to explore its skills. Hover to preview, drag to reorganize.'}
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
          onMouseLeave={() => {
            setSelectedSkill(null);
            setClusterSummary(null);
          }}
        >
          {/* Breadcrumb strip — only visible in drill-down */}
          {activeCluster && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: isDarkMode ? 'rgba(26, 23, 23, 0.9)' : 'rgba(248, 247, 247, 0.92)',
                borderBottom: '1px solid var(--color-hairline)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <button
                onClick={handleBack}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-hairline-strong)',
                  color: isDarkMode ? 'var(--color-on-dark)' : 'var(--color-ink)',
                  padding: '3px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: 'var(--rounded-none)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.backgroundColor = isDarkMode
                    ? 'var(--color-surface-dark-elevated)'
                    : 'var(--color-surface-card)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                ← ALL CLUSTERS
              </button>
              <span style={{ color: isDarkMode ? 'var(--color-on-dark-mute)' : 'var(--color-stone)' }}>
                SKILLS &gt; {clusterLabel?.toUpperCase()}
              </span>
            </div>
          )}

          <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
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
            {activeCluster ? 'SELECTED NODE // INSPECTOR' : 'CLUSTER // INSPECTOR'}
          </div>

          {/* Level 2: Individual skill inspector */}
          {selectedSkill ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <h3 className="heading-md" style={{ color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
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

              {/* Connected projects */}
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
          ) : clusterSummary ? (
            /* Level 1: Cluster summary inspector */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <h3 className="heading-md" style={{ color: 'var(--color-ink)' }}>
                  {clusterSummary.label.toUpperCase()}
                </h3>
                <span className="caption-md" style={{ color: 'var(--color-mute)' }}>
                  {clusterSummary.count} skills | Avg proficiency: {clusterSummary.avgProf}%
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
                    width: `${clusterSummary.avgProf}%`,
                    backgroundColor: 'var(--color-ink)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <p className="body-md" style={{ color: 'var(--color-body)' }}>
                // Click the cluster node to drill down into individual skills, connections, and related projects.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ash)', minHeight: '140px' }}>
              <p className="body-md">
                {activeCluster
                  ? '// Hover over any skill node to load details'
                  : '// Hover over a cluster to preview, click to explore'}
              </p>
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
