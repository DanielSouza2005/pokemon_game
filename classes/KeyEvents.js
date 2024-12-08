class KeyEvents {
    constructor({ keys }) {
        this.lastKey = '';
        this.keys = keys;
    }

    addEventListenerKeyDown() {
        let clicked = false; 
        window.addEventListener('keydown', (e) => {                     
            if (!clicked) {
                clicked = true;

                if ((e.key === 'w') || (e.key === 'a') || (e.key === 's') || (e.key === 'd')){
                    audio.map.play();  
                }

            }   

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

    addEventListenerAudio(){
        
        addEventListener('click', () => {
                       
        })
    }
}