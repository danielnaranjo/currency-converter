export default class SidebarController {

  view = null;
  model = null;

  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  toggleSidebar = () => {
    const { model } = this;
    model.toggleSidebar();
    return model.sidebarVisible ? this.showSidebar() : this.closeSidebar();
  }

  showSidebar = () => {
    const { sidebar, app } = this.view;
    sidebar.style.width = '75%';
    setTimeout(() => {
      app.addEventListener('click', this.toggleSidebar);
    }, 50);
  }

  closeSidebar = () => {
    const { sidebar, app } = this.view;
    sidebar.style.width = '0';
    app.removeEventListener('click', this.toggleSidebar);
  }
}
