export default function() {
  let noScrollWdith = 0;
  let scrollWidth = 0;
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.top = "-1000px";
  div.style.overflow = "hidden";
  document.body.appendChild(div);
  noScrollWdith = div.clientWidth;
  div.style.overflow = "scroll";
  scrollWidth = div.clientWidth;
  document.body.removeChild(div);
  return noScrollWdith - scrollWidth;
}
