$( ".name span" ).click(() => {
  $( ".name" ).replaceWith( "<p><input name='name' type='text' placeholder='Name'></input></p>" );
});

$( ".occupation span" ).click(() => {
  $( ".occupation" ).replaceWith( "<p><input name='occupation' type='text' placeholder='Occupation'></input></p>" );
});

$( ".email span" ).click(() => {
  $( ".email" ).replaceWith( "<p><input name='email' type='email' placeholder='Email'></input></p>" );
});
