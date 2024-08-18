class KeyEvents {
    constructor({ keys }) {
        this.lastKey = '';
        this.keys = keys;
    }

    addEventListenerKeyDown() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'w':
                    keys.w.pressed = true;
                    this.lastKey = e.key;
                    break;
        
                case 'a':
                    keys.a.pressed = true;
                    this.lastKey = e.key;
                    break;  
                    
                case 's':
                    keys.s.pressed = true;
                    this.lastKey = e.key;
                    break;
        
                case 'd':
                    keys.d.pressed = true;
                    this.lastKey = e.key;
                    break;    
            }
        });
    }

    addEventListenerKeyUp(){
        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'w':
                    keys.w.pressed = false;
                    break;
        
                case 'a':
                    keys.a.pressed = false;
                    break;  
                    
                case 's':
                    keys.s.pressed = false;
                    break;
        
                case 'd':
                    keys.d.pressed = false;
                    break;    
            }
        });    
    }
}