// document.addEventListener('DOMContentLoaded', () => {
//     // Get the current path from the URL
//     const currentPath = window.location.pathname.split('/').pop();
  
//     // Select all anchor tags within the footer
//     const links = document.querySelectorAll('.footerContainer > a');
  
//     links.forEach(link => {
//       // Get the href attribute of each link
//       const linkPath = link.getAttribute('href');
  
//       // Check if the link's href matches the current path
//       if (linkPath === currentPath) {
//         // link.classList.add('rounded-full', 'bg-secondary', 'w-[100px]');
//       } else {
//         link.classList.remove('rounded-full', 'bg-secondary', 'w-[100px]');
//       }
//     });
//   });