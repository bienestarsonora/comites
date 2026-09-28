(function(){
  'use strict';

  function classifyAction(el){
    if(!el || el.nodeType!==1) return;
    const text=(el.textContent||'').trim().toLowerCase();
    const attrs=[...el.attributes].map(a=>a.name+' '+a.value).join(' ').toLowerCase();
    const hint=(el.getAttribute('title')||el.getAttribute('aria-label')||'').toLowerCase();
    const all=text+' '+attrs+' '+hint;

    if(/nuevo|nueva|agregar|añadir|subir recurso|subir documento|newcommittee|newmanagement|newaction|newdocument|newtraining|newuser/.test(all)) {
      el.classList.add('gov-action-add');
    }
    if(/eliminar|borrar|delete/.test(all)) {
      el.classList.add('gov-action-delete');
      if(!text) el.classList.add('gov-icon-delete');
    }
    if(/editar|modificar|edit/.test(all)) {
      el.classList.add('gov-action-edit');
      if(!text) el.classList.add('gov-icon-edit');
    }
    if(/visualizar|ver ficha|ver detalle|view/.test(all)) {
      el.classList.add('gov-action-view');
      if(!text) el.classList.add('gov-icon-view');
    }
    if(/siguiente|continuar/.test(all)) el.classList.add('gov-action-next');
    if(/regresar|volver|anterior|cancelar/.test(all)) el.classList.add('gov-action-back');

    if(!el.getAttribute('aria-label') && !text){
      if(el.classList.contains('gov-icon-delete')) el.setAttribute('aria-label','Eliminar registro');
      else if(el.classList.contains('gov-icon-edit')) el.setAttribute('aria-label','Editar registro');
      else if(el.classList.contains('gov-icon-view')) el.setAttribute('aria-label','Visualizar registro');
    }
  }

  function enhance(){
    document.querySelectorAll('button,.btn').forEach(classifyAction);

    document.querySelectorAll('.modal-card,.admin-drawer aside').forEach(panel=>{
      if(!panel.getAttribute('role')) panel.setAttribute('role','dialog');
      panel.setAttribute('aria-modal','true');
      const heading=panel.querySelector('h1,h2,h3');
      if(heading){
        if(!heading.id) heading.id='dlg-'+Math.random().toString(36).slice(2,10);
        panel.setAttribute('aria-labelledby',heading.id);
      }
    });

    document.querySelectorAll('.modal-close,.admin-close').forEach(btn=>{
      if(!btn.getAttribute('aria-label')) btn.setAttribute('aria-label','Cerrar');
    });

    document.querySelectorAll('.admin-table-wrap table').forEach(table=>{
      if(!table.querySelector('caption')){
        const caption=document.createElement('caption');
        caption.className='gov-table-caption';
        const panel=table.closest('.admin-panel');
        caption.textContent=panel?.querySelector('h2')?.textContent?.trim()||'Registros administrativos';
        table.prepend(caption);
      }
    });

    document.querySelectorAll('.admin-drawer input,.admin-drawer select,.admin-drawer textarea,.modal.form-card input,.modal.form-card select,.modal.form-card textarea').forEach(field=>{
      if(field.required) field.setAttribute('aria-required','true');
    });
  }

  function setupAccessibilityTools(){
    const root=document.documentElement;
    const contrastBtn=document.querySelector('[data-high-contrast]');
    const sizeButtons=document.querySelectorAll('[data-text-size]');
    const storedScale=localStorage.getItem('comites-text-scale')||'normal';
    const storedContrast=localStorage.getItem('comites-high-contrast')==='1';

    const applyScale=value=>{
      if(value==='small'||value==='large') root.dataset.textScale=value;
      else delete root.dataset.textScale;
      localStorage.setItem('comites-text-scale',value);
    };
    const applyContrast=value=>{
      document.body.classList.toggle('high-contrast',value);
      contrastBtn?.setAttribute('aria-pressed',String(value));
      localStorage.setItem('comites-high-contrast',value?'1':'0');
    };

    applyScale(storedScale);
    applyContrast(storedContrast);

    sizeButtons.forEach(btn=>btn.addEventListener('click',()=>{
      const action=btn.dataset.textSize;
      if(action==='decrease') applyScale('small');
      else if(action==='increase') applyScale('large');
      else applyScale('normal');
    }));
    contrastBtn?.addEventListener('click',()=>applyContrast(!document.body.classList.contains('high-contrast')));
  }

  function init(){
    enhance();
    setupAccessibilityTools();
    const observer=new MutationObserver(mutations=>{
      let needsEnhance=false;
      for(const mutation of mutations){
        for(const node of mutation.addedNodes){
          if(node.nodeType!==1) continue;
          if(node.matches?.('button,.btn')) classifyAction(node);
          node.querySelectorAll?.('button,.btn').forEach(classifyAction);
          if(node.matches?.('.admin-panel,.modal,.admin-table-wrap') || node.querySelector?.('.admin-table-wrap,.form-card')){
            needsEnhance=true;
          }
        }
      }
      if(needsEnhance) enhance();
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
