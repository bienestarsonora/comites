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

  function init(){
    enhance();
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
