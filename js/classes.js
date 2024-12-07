class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset; // Se agregó `offset` para ajustar la posición del sprite
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, // Se usa `this.offset.x` para ajustar la posición horizontal
            this.position.y - this.offset.y, // Se usa `this.offset.y` para ajustar la posición vertical
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    update() {
        this.draw(); // Dibuja el sprite
        this.framesElapsed++; // Incrementa los frames transcurridos
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0; // Reinicia la animación al primer frame
            }
        }
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        super({ position, imageSrc, scale, framesMax, offset }); // Se pasó `offset` al constructor de `Sprite`
        this.velocity = velocity || { x: 0, y: 0 };
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: { x: this.position.x, y: this.position.y },
            offset, // Se agregó para ajustar la posición de la caja de ataque
            width: 100,
            height: 50
        };
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    draw() {
        super.draw(); // Llama al método `draw()` de la clase `Sprite` para dibujar el sprite
        if (this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

    update() {
        this.draw(); // Dibuja el luchador
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x; // Ajusta la posición horizontal de la caja de ataque
        this.attackBox.position.y = this.position.y; // Ajusta la posición vertical de la caja de ataque

        this.position.x += this.velocity.x; // Actualiza la posición horizontal del luchador
        this.position.y += this.velocity.y; // Actualiza la posición vertical del luchador

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0; // Detiene al luchador en el suelo
        } else this.velocity.y += gravity; // Aplica gravedad
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false; // Termina el estado de ataque después de 100ms
        }, 100);
    }
}
