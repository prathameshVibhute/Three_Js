let currentProject: any = null;

let beforeRouteChange: (() => void) | null = null;

export function setBeforeRouteChange(fn: () => void) {
  beforeRouteChange = fn;
}

// Simple router
async function loadProject() {
  if (currentProject && typeof currentProject.dispose === 'function') {
    currentProject.dispose();
  }

  const route = location.hash;

  // 🔥 This runs BEFORE route changes
  beforeRouteChange?.();

  if (route === '#/rectarealight') {
    const module: any = await import('./rectAreaLightMirror.ts');
    currentProject = module.default();
  } else if (route === '#/galaxygenerator') {
    const module: any = await import('./galaxyGenerator.ts');
    currentProject = module.default();
  } else if(route === '#/particleswave') {
    const module: any = await import('./particlesWave.ts');
    currentProject = module.default();
  } if(route === '#/particleswave') {
    const module: any = await import('./particlesWave.ts');
    currentProject = module.default();
  }
  else {
    // default
    location.hash = '#/rectarealight';
  }
}

window.addEventListener('hashchange', loadProject);
window.addEventListener('DOMContentLoaded', loadProject);
