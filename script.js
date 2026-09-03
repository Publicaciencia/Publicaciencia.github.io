function filterWorks(){
  const input = document.getElementById("workSearch");
  if(!input) return;
  const cards = [...document.querySelectorAll("[data-work]")];
  input.addEventListener("input",()=>{
    const q = input.value.toLowerCase().trim();
    cards.forEach(card=>{
      card.style.display = card.innerText.toLowerCase().includes(q) ? "" : "none";
    });
  });
}
document.addEventListener("DOMContentLoaded", filterWorks);
