const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.setAttribute("style", "top: "+(e.pageY)+"px; left: "+(e.pageX)+"px;")
})

const links = document.querySelectorAll(".link");

links.forEach(link => {
    link.addEventListener("mouseover", () => {
        cursor.classList.add("cursor--active");
    });
    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor--active");
    });
})