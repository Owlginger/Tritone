
document.addEventListener('DOMContentLoaded', () => {

    let toolbarButtons = document.getElementsByClassName('player-toolbar-button');

    for (let index = 0; index < toolbarButtons.length; index++) {
        const element = toolbarButtons[index];
        
        element.addEventListener('click', (event) => {
            const type = event.target;
            
            if(type.id === 'player-close-btn') {
                window.electron.closeWindow(true);
            } else if(type.id === 'player-minimize-btn') {
                window.electron.minimizeWindow(true);
            }
            
        });

        element.addEventListener('mouseenter', (event)=> {
            buttonMouseEntered(event);
        });
    
        element.addEventListener('mouseleave', (event)=> {
            buttonMouseLeave(event);
        });
    }

    window.electron.onWindowBlur((blur) => {
        const playerWin = document.getElementById('player-window')
        playerWin.style.border = 'none';
    });

    window.electron.onActivate((activate) => {
        const playerWin = document.getElementById('player-window')
        playerWin.style.border = '1px solid white';
    })
    
});


function buttonMouseEntered(event) {
    let target = event.target;
    target.style.backgroundColor = 'rgba(0, 0, 0, 0.815)';

    
}

function buttonMouseLeave(event) {
    let target = event.target;
    target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

}

class LyrePlayer extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'})

        const div = document.createElement('div')
        div.id = 'lyre-player';

        div.innerHTML = this.innerHTML;
        this.innerHTML = '';
        //this.appendChild(div);
        this.shadowRoot.append(div);
    }
}

customElements.define('lyre-player', LyrePlayer)