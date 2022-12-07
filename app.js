let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  //initiate controller
  controller = new ScrollMagic.Controller();
  // select some things

  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  slides.forEach((slide) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    const slideTimel = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });

    //first is thing youre selecting,
    //second is time, e.g. 1 second
    // third is object with properties you want to change
    // gsap.to(revealImg, 1, {x: "100%" });

    slideTimel.fromTo(revealImg, { x: "0%" }, { x: "150%" });
    slideTimel.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTimel.fromTo(revealText, { x: "0%" }, { x: "150%" }, "-=0.75");
    slideTimel.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");

    //create slide scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      // triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTimel)
      // .addIndicators({
      //   colorStart: 'white',
      //   colorTrigger: 'white',
      //   name: "slide"
      // })
      .addTo(controller);
  });
}

const mouse = document.querySelector(".cursor");
let mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");

const cursor = (e) => {
  mouse.style.top = `${e.pageY}px`;
  mouse.style.left = `${e.pageX}px`;
};

const activeCursor = (e) => {
  const item = e.target;
  const itemParent = e.target.parentElement;
  // console.log(item.parentElement);
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }

  if (itemParent.classList.contains("hero-img") || item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseText.innerText = "";
  }
};

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "white" });
    //needed to change the y position because it wasnt a perfect x shape
    //line one up, line 2
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    // document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    // document.body.classList.remove("hide");
  }
}

const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      }
    },
    {
      namespace: "blog",
      beforeEnter() {
        logo.href = "../index.html";
         animateSlides();
      },
      beforeLeave() {
        controller.destroy();
        slideScene.destroy();
      }
    }
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //An Animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { display: "show" }, { display: "none" });
        // current.container.destroy();
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //Scroll to the top
        window.scrollTo(0, 0);
        //An Animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        // tl.fromTo(
        //   ".swipe",
        //   1,
        //   { x: "0%" },

        //   { x: "100%", stagger: 0.2, onComplete: done }
        // );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".nav-header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" },
          "-=1.5"
        );
      },
    },
  ],
});
//event listeners

burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);

// window.addEventListener('load', () => {
//     animateSlides();
// });

// console.log(e.target);
