<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css">

<div class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide"><img src="img1.jpg"></div>
    <div class="swiper-slide"><img src="img2.jpg"></div>
    <div class="swiper-slide"><img src="img3.jpg"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js"></script>

<script>
new Swiper('.swiper', {
  loop:true,
  autoplay:{ delay:3000 },
  effect:'fade'
});
</script>