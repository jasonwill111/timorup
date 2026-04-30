globalThis.process??={};globalThis.process.env??={};const l=window.location.pathname.split("/").filter(t=>t)[2],a=document.getElementById("loading"),u=document.getElementById("access-denied"),h=document.getElementById("not-found"),p=document.getElementById("content");let c=null,i=null,g=null;async function v(){try{const e=await(await fetch("/api/auth/session")).json();if(e.session?.user)return e.session.user}catch(t){console.error("Error getting session:",t)}return null}async function w(){try{const e=await(await fetch(`/api/businesses/${l}`)).json();return e.success?e.data:(a?.classList.add("hidden"),h?.classList.remove("hidden"),null)}catch(t){return console.error("Error loading business:",t),a?.classList.add("hidden"),h?.classList.remove("hidden"),null}}async function y(t){try{const n=await(await fetch(`/api/account/subscription/${t}`)).json();if(n.success)return n.data}catch(e){console.error("Error loading subscription:",e)}return null}async function m(t){try{const n=await(await fetch(`/api/products?businessPageId=${t}`)).json();if(n.success)return n.data}catch(e){console.error("Error loading products:",e)}return[]}async function b(){if(c=await v(),!c){a?.classList.add("hidden"),u?.classList.remove("hidden");return}if(i=await w(),!i)return;if(i.ownerId!==c.id){a?.classList.add("hidden"),u?.classList.remove("hidden");return}g=await y(i.id),document.title=`Manage Products - ${i.title} - TIMORLIST`;const t=document.getElementById("business-title"),e=document.getElementById("business-subtitle");t&&(t.textContent=i.title),e&&(e.textContent="Manage your products");const n=document.getElementById("add-product-btn"),r=document.getElementById("upgrade-banner");g?.status==="active"?n&&(n.href=`/business/${l}/product/new`,n.classList.remove("hidden")):r&&r.classList.remove("hidden");const s=await m(i.id);f(s),a?.classList.add("hidden"),p?.classList.remove("hidden")}function f(t){const e=document.getElementById("products-loading"),n=document.getElementById("products-empty"),r=document.getElementById("products-list");if(!(!e||!n||!r)){if(e.classList.add("hidden"),t.length===0){n.classList.remove("hidden");return}t.forEach(s=>{const o=s.images&&s.images.length>0?`/api/media/${s.images[0].mediaId}`:null,d=document.createElement("div");d.className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow",d.innerHTML=`
        <div class="aspect-square bg-muted relative">
          ${o?`<img src="${o}" alt="${s.title}" class="w-full h-full object-cover" />`:`<div class="flex items-center justify-center h-full text-4xl font-bold text-muted-foreground">${s.title.charAt(0)}</div>`}
          <div class="absolute top-2 right-2 flex gap-1">
            <a href="/business/${l}/product/${s.id}/edit" class="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </a>
            <a href="/business/${l}/product/${s.id}" class="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100" title="View">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </a>
            <button data-delete="${s.id}" class="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-red-50 text-red-500" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-medium truncate">${s.title}</h3>
          <p class="text-sm text-muted-foreground">${s.price}</p>
        </div>
      `,r.appendChild(d)}),r.querySelectorAll("[data-delete]").forEach(s=>{s.addEventListener("click",async o=>{o.preventDefault();const d=o.target.closest("button")?.dataset.delete;d&&confirm("Are you sure you want to delete this product?")&&await E(d)})})}}async function E(t){try{const n=await(await fetch(`/api/products/${t}?userId=${c.id}`,{method:"DELETE"})).json();if(n.success){const r=await m(i.id),s=document.getElementById("products-list"),o=document.getElementById("products-empty");s&&(s.innerHTML=""),o&&o.classList.add("hidden"),f(r)}else alert(n.error?.message||"Failed to delete product")}catch(e){console.error("Error deleting product:",e),alert("Failed to delete product")}}b();
