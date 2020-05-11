class UI {
  constructor(){
    this.form = document.querySelector('form');
    this.name = document.querySelector('#name')
    this.parent = document.querySelector('#parent')
    this.department = document.querySelector('#department')
    this.addBtn = document.getElementById('addEmployee');
  }
  clearForm() {
    ui.name.value = '';
    ui.parent.value = '';
    ui.department.value = '';
  }
}

const ui = new UI;

const App = (function(ui) {
  // Event Listeners
  const loadEventListeners = function(){
    ui.addBtn.addEventListener('click',addEmployee);
  }

  // Listener Functions
  const addEmployee = function(e){
    e.preventDefault();
    db.collection('employees').add({
      name: ui.name.value,
      parent: ui.parent.value,
      department: ui.department.value
    })
    
    // clear form
    ui.clearForm()

    // close modal
    let instance = M.Modal.getInstance(modal);
    instance.close()
  }
  // Public Methods
  return {
    init: function(){
      console.log('Initializing...');
      loadEventListeners()
    }
  }
})(ui, db);

App.init();

