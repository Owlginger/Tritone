
export class ControlPlaneMenu {

  private menu: HTMLElement;
  private host: HTMLElement;
  
  enteredSubmenu: boolean = false;
  menuOpen: boolean = true;

  constructor() { 
    this.menu = document.getElementById('menu') as HTMLElement;
    this.host = this.menu.parentElement;

    this.init();
  }

  private init: Function = (): void {
    const head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.href = 'control-plane-menu.css';
    link.rel = 'stylesheet'
    head.appendChild(link);


    const menu = this.menu;
    const menuItems = menu.children;

    for (let index = 0; index < menuItems.length; index++) {
      const element = (menuItems[index].children[0] as HTMLElement);

        element.addEventListener('mouseenter', (event) => {
          this.displaySubmenu(event);
        });

        element.addEventListener('mouseleave', (event) => {
          this.hideSubmenu(event);
        });
    }

    let submenus = (this.host as HTMLElement).querySelectorAll('.submenu');

    for (let index = 0; index < submenus.length; index++) {
        const element = (submenus[index] as HTMLElement);

        element.addEventListener('mouseenter', (event) => {
          (element as HTMLElement).style.display = 'block';
            this.enteredSubmenu = true;
        });

        element.addEventListener('mouseleave', (event) => {
          (element as HTMLElement).style.display = 'block';
          element.style.display = 'none';
          this.enteredSubmenu = false;
        });

        element.style.display = 'none';
    }
  }

  private displaySubmenu: Function = (event: Event): void => {
    const target = (event.target as HTMLElement);
    const sibling = target.nextElementSibling;
    (sibling as HTMLElement).style.display = 'block';
  }
 
  private hideSubmenu: Function = (event: Event): void => {
    setTimeout(() => {
        if(!this.enteredSubmenu) {
            let target = (event.target as HTMLElement);
            let sibling = (event.target as HTMLElement).nextElementSibling;

            (sibling as HTMLElement).style.display = 'none';
        }
    }, 100);
  }

}
