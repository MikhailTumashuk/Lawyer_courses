alert('vrvevw')
function scrollTo(element) {
    window.scroll({
      left: 0, 
      top: element.offsetTop, 
      behavior: 'smooth'
    })
  }
  
  var button = document.querySelector('#go_to_courses');
  var courses_block = document.querySelector('.courses_block');

  
  button.addEventListener('click', () => {
    scrollTo(courses_block);
  })