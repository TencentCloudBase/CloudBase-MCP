---
name: "tcb-ui-design"
displayName: "TCB UI Design Guidelines"
description: "Professional UI design and frontend interface guidelines for creating distinctive, production-grade web interfaces with exceptional aesthetic quality. Includes comprehensive design processes, aesthetic directions, and anti-patterns to avoid generic AI aesthetics."
keywords: ["ui design", "frontend", "interface", "aesthetic", "tailwind", "typography", "color palette", "layout", "界面设计", "前端", "用户界面", "UI设计", "网页设计", "界面", "设计规范"]
author: "TCB Team"
---

# TCB UI Design Guidelines

## Overview

Professional UI design and frontend interface guidelines specifically crafted for creating web pages, mini-program interfaces, prototypes, and frontend UI components that require distinctive, production-grade design with exceptional aesthetic quality.

This power provides a comprehensive framework for avoiding generic AI aesthetics and creating memorable, context-specific interfaces. It includes mandatory design specifications, aesthetic direction options, forbidden patterns, and self-audit checklists to ensure every interface meets professional standards.

**Key Features:**
- Mandatory pre-design specification process
- 11 distinctive aesthetic direction options (brutally minimal, maximalist chaos, retro-futuristic, etc.)
- Comprehensive forbidden patterns list (colors, fonts, layouts, icons)
- Professional icon library requirements
- Self-audit checklist for quality assurance
- Context-aware recommendations for different app types

## When to Use This Power

Use this power for **frontend UI design and interface creation** in any project that requires:

- Creating web pages or interfaces
- Creating mini-program pages or interfaces  
- Designing frontend components
- Creating prototypes or interfaces
- Handling styling and visual effects
- Any development task involving user interfaces

**Do NOT use for:**
- Backend logic or API design
- Database schema design
- Pure business logic without UI components

## Design Process Overview

### 1. Mandatory Pre-Design Specification

**⚠️ CRITICAL: You MUST explicitly output this analysis before writing ANY interface code:**

```
DESIGN SPECIFICATION
====================
1. Purpose Statement: [2-3 sentences about problem/users/context]
2. Aesthetic Direction: [Choose ONE from approved list]
3. Color Palette: [List 3-5 specific colors with hex codes]
4. Typography: [Specify exact font names]
5. Layout Strategy: [Describe specific asymmetric/diagonal/overlapping approach]
```

### 2. Six-Step Design Process

1. **User Experience Analysis** - Analyze main functions and user needs
2. **Product Interface Planning** - Define key interfaces and information architecture
3. **Aesthetic Direction Determination** - Choose clear aesthetic style and visual language
4. **High-Fidelity UI Design** - Design interfaces aligned with real iOS/Android standards
5. **Frontend Prototype Implementation** - Use Tailwind CSS with professional icon libraries
6. **Realism Enhancement** - Use real UI images and resources

## Aesthetic Direction Options

Choose ONE of these distinctive aesthetic directions (FORBIDDEN: "modern", "clean", "simple"):

- **Brutally minimal** - Extreme restraint and precision
- **Maximalist chaos** - Rich, layered, abundant visual elements
- **Retro-futuristic** - Nostalgic sci-fi aesthetics
- **Organic/natural** - Flowing, nature-inspired forms
- **Luxury/refined** - Elegant, premium materials and spacing
- **Playful/toy-like** - Whimsical, colorful, approachable
- **Editorial/magazine** - Typography-focused, content-driven
- **Brutalist/raw** - Bold, unpolished, architectural
- **Art deco/geometric** - Structured, ornamental patterns
- **Soft/pastel** - Gentle, muted, calming tones
- **Industrial/utilitarian** - Functional, mechanical aesthetics

### Context-Aware Recommendations

- **Education apps**: Editorial/Organic/Retro-futuristic (avoid generic blue)
- **Productivity apps**: Brutalist/Industrial/Luxury
- **Social apps**: Playful/Maximalist/Soft
- **Finance apps**: Luxury/Art deco/Brutally minimal

## Forbidden Patterns (Anti-Patterns)

### ❌ Forbidden Colors
- Purple (#800080-#9370DB)
- Violet (#8B00FF-#EE82EE) 
- Indigo (#4B0082-#6610F2)
- Fuchsia (#FF00FF-#FF77FF)
- Blue-purple gradients

### ❌ Forbidden Fonts
- Inter
- Roboto
- Arial
- Helvetica
- system-ui
- -apple-system

### ❌ Forbidden Layouts
- Standard centered layouts without creative breaking
- Simple grid without creative breaking
- Predictable component patterns

### ❌ Forbidden Icons
- Emoji characters as icons (🚀, ⭐, ❤️, etc.)
- Must use professional icon libraries instead

## Required Professional Icon Libraries

**✅ REQUIRED: Use these professional icon libraries:**

- **FontAwesome** (recommended for most projects)
- **Heroicons** (for Tailwind CSS projects)
- **Material Icons**
- **Feather Icons**
- **Lucide Icons**

**Icon Implementation:**
```html
<!-- ✅ GOOD: FontAwesome -->
<i className="fas fa-rocket"></i>

<!-- ✅ GOOD: Heroicons -->
<svg className="w-5 h-5">...</svg>

<!-- ❌ BAD: Emoji -->
<span>🚀</span>
```

## Typography Guidelines

### Distinctive Font Selection

Choose beautiful, unique, and interesting fonts that align with your aesthetic direction:

**Examples by Aesthetic:**
- **Editorial**: 'Playfair Display', serif
- **Brutalist**: 'Space Mono', monospace  
- **Luxury**: 'DM Serif Display', serif
- **Organic**: 'Crimson Text', serif
- **Playful**: 'Fredoka One', cursive

### Font Pairing Strategy
- Choose distinctive display fonts paired with refined body fonts
- Consider using distinctive font combinations to elevate interface aesthetics
- Ensure font selection aligns with overall aesthetic direction

## Color & Theme Strategy

### Effective Color Approaches
- **Dominant Colors with Accents**: More effective than evenly-distributed schemes
- **Unified Aesthetics**: Use CSS variables for consistency
- **Theme Consistency**: Choose dark or light themes based on aesthetic direction

### Creative Color Examples
```css
/* ✅ GOOD: Context-specific alternatives */
.warm-editorial { 
  background: linear-gradient(to bottom right, #fef7cd, #fed7aa, #fecaca); 
}

.dark-organic { 
  background: linear-gradient(to top right, #064e3b, #0f766e); 
}

.bold-retro { 
  background: linear-gradient(to right, #FF6B35, #F7931E); 
}
```

## Layout & Spatial Composition

### Creative Layout Principles
- **Break Conventions**: Use unexpected layouts, asymmetry, overlap, diagonal flow
- **Break the Grid**: Use grid-breaking elements strategically
- **Negative Space Control**: Either use generous negative space or control density intentionally

### Layout Examples
```tsx
// ✅ GOOD: Asymmetric layout with creative positioning
<div className="grid grid-cols-12 min-h-screen">
  <div className="col-span-7 col-start-2 pt-24">
    {/* Content with intentional asymmetry */}
  </div>
</div>

// ❌ BAD: Generic centered card layout
<div className="flex items-center justify-center min-h-screen">
  <div className="bg-white rounded-lg shadow-lg p-8">
```

## Motion Design Guidelines

### Animation Strategy
- **Technology Choice**: Prioritize CSS-only solutions for HTML, React projects can use Motion library
- **High-Impact Moments**: Focus on well-orchestrated page load animations using animation-delay for staggered reveals
- **Interactive Surprises**: Use scroll-triggering and hover states to create delightful moments

### Implementation Approach
- One well-orchestrated animation creates more delight than scattered micro-interactions
- Use animations for effects and meaningful micro-interactions
- Match animation complexity to aesthetic vision

## Self-Audit Checklist

**🔍 Run these checks before submitting any UI code:**

### 1. Color Audit
```bash
# Search for forbidden colors in your code
grep -iE "(violet|purple|indigo|fuchsia)" [your-file]
# If found → VIOLATION → Choose alternative from Design Specification
```

### 2. Font Audit  
```bash
# Search for forbidden fonts
grep -iE "(Inter|Roboto|system-ui|Arial|-apple-system)" [your-file]
# If found → VIOLATION → Use distinctive font from Design Specification
```

### 3. Icon Audit
```bash
# Search for emoji usage
grep -iE "(🚀|⭐|❤️|👍|🔥|💡|🎉|✨)" [your-file]
# If found → VIOLATION → Replace with professional icon library
```

### 4. Layout Audit
- Does the layout use asymmetry/diagonal/overlap? (Required: YES)
- Is there creative grid-breaking? (Required: YES)  
- Are elements only centered with symmetric spacing? (Allowed: NO)

### 5. Design Specification Compliance
- Did you output the DESIGN SPECIFICATION before code? (Required: YES)
- Does the code match the aesthetic direction you declared? (Required: YES)

## Backgrounds & Visual Details

### Atmosphere Creation
Create atmosphere and depth rather than defaulting to solid colors:

- **Gradient meshes** - Complex, organic color transitions
- **Noise textures** - Subtle grain and texture overlays
- **Geometric patterns** - Structured, repeating elements
- **Layered transparencies** - Depth through opacity layers
- **Dramatic shadows** - Bold, directional lighting effects
- **Decorative borders** - Ornamental edge treatments
- **Custom cursors** - Interactive element customization
- **Grain overlays** - Film-like texture effects

### Creative Implementation
- Match implementation complexity to aesthetic vision
- Maximalist designs need elaborate code with extensive animations
- Minimalist designs need restraint, precision, and careful attention to detail
- Elegance comes from executing the vision well

## Trigger Word Detector

**🚨 If you find yourself typing these words, STOP immediately:**

- "gradient" + "purple/violet/indigo/fuchsia/blue-purple"
- "card" + "centered" + "shadow"  
- "Inter" or "Roboto" or "system-ui"
- "modern" or "clean" or "simple" (without specific style direction)
- Emoji characters (🚀, ⭐, ❤️, etc.) as icons

**Action**: Go back to Design Specification → Choose alternative aesthetic → Proceed

## Implementation Requirements

All interface prototypes must be:

- **Production-Grade Quality**: Functionally complete and ready for development
- **Visual Impact**: Visually striking and memorable
- **Aesthetic Consistency**: Have a clear aesthetic point-of-view, cohesive and unified
- **Meticulously Refined**: Every detail is carefully polished

## Best Practices Summary

1. **Always start with Design Specification** - Never skip this mandatory step
2. **Choose distinctive aesthetics** - Avoid generic "modern" or "clean" descriptions
3. **Use professional icon libraries** - Never use emoji as icons
4. **Break layout conventions** - Embrace asymmetry and creative positioning
5. **Select unique typography** - Avoid system fonts and common choices
6. **Create contextual color palettes** - Avoid forbidden purple/violet schemes
7. **Run self-audit checks** - Validate against all forbidden patterns
8. **Match complexity to vision** - Execute your chosen aesthetic direction fully

Remember: You are capable of extraordinary creative work. Don't hold back - show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

---

**Design Framework**: TCB UI Design Guidelines  
**Implementation**: Tailwind CSS + Professional Icon Libraries