<script>
new Swiper('.swiper', {

  loop: true,

  autoplay:{
    delay:3000,
    disableOnInteraction:false
  },

  effect: 'coverflow',

  coverflowEffect:{
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  },

  navigation:{
    nextEl:'.swiper-button-next',
    prevEl:'.swiper-button-prev'
  },

  pagination:{
    el:'.swiper-pagination',
    clickable:true
  }

/});
</script>

rotate: 70,
depth: 200,