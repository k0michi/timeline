export default class App {
  $root: HTMLElement;
  $canvas: HTMLCanvasElement | undefined;
  $clock: HTMLDivElement | undefined;
  $clockContainer: HTMLDivElement | undefined;
  resizeObserver: ResizeObserver | undefined;
  ctx: CanvasRenderingContext2D | undefined;
  ratio: number = 1;
  scale = 10; // pixels/second

  constructor($root: HTMLElement) {
    this.$root = $root;
  }

  initialize() {
    this.$clockContainer = document.createElement('div');
    this.$clockContainer.classList.add('clock-container');
    this.$root.append(this.$clockContainer);

    this.$clock = document.createElement('div');
    this.$clock.classList.add('clock');
    this.$clockContainer.append(this.$clock);

    this.$canvas = document.createElement('canvas');
    this.$root.append(this.$canvas);
    this.ctx = this.$canvas.getContext('2d')!;

    const r = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      this.onResize();
    });

    r.observe(this.$canvas);

    this.onResize();

    window.addEventListener('wheel', e => {
      const coeff = 1000;
      this.scale *= Math.exp(-e.deltaY / coeff);
      console.log(this.scale)
    });
  }

  onResize() {
    const ratio = window.devicePixelRatio ?? 1;
    const ctx = this.ctx!;
    this.$canvas!.width = this.$canvas!.clientWidth * ratio;
    this.$canvas!.height = this.$canvas!.clientHeight * ratio;
    ctx.scale(ratio, ratio);
    this.ratio = ratio;
  }

  clear() {
    const ctx = this.ctx!;
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, this.$canvas!.width, this.$canvas!.height);
  }

  getCanvasSize() {
    return [
      this.$canvas!.width / this.ratio,
      this.$canvas!.height / this.ratio
    ];
  }

  resetTransform() {
    const ctx = this.ctx!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(this.ratio, this.ratio);
  }

  render(time: DOMHighResTimeStamp) {
    const ctx = this.ctx!;
    this.clear();

    const now = new Date();
    const [width, height] = this.getCanvasSize();
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    // Dates
    {
      const ceil = ceilDate(now);
      const scaleD = 60 * 60 * 24;
      const minuteOffset = subtractDate(ceil, now) / 1000 /scaleD;

      const style = 'white';
      const barHeight = 96;
      ctx.lineWidth = 1;
      ctx.strokeStyle = style;

      for (let x = widthHalf + (minuteOffset * this.scale * scaleD); x < width; x += this.scale * scaleD) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }

      for (let x = widthHalf + ((minuteOffset - 1) * this.scale * scaleD); x >= 0; x -= this.scale * scaleD) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }
    }

    // Hours
    {
      const ceil = ceilHour(now);
      const scaleH = 60 * 60;
      const minuteOffset = subtractDate(ceil, now) / 1000 / scaleH;

      const style = 'white';
      const barHeight = 64;
      ctx.lineWidth = 1;
      ctx.strokeStyle = style;

      for (let x = widthHalf + (minuteOffset * this.scale * scaleH); x < width; x += this.scale * scaleH) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }

      for (let x = widthHalf + ((minuteOffset - 1) * this.scale * scaleH); x >= 0; x -= this.scale * scaleH) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }
    }

    // Minutes
    {
      const ceil = ceilMinute(now);
      const scaleM = 60;
      const minuteOffset = subtractDate(ceil, now) / 1000 / scaleM;

      const style = 'white';
      const barHeight = 32;
      ctx.lineWidth = 1;
      ctx.strokeStyle = style;

      for (let x = widthHalf + (minuteOffset * this.scale * scaleM); x < width; x += this.scale * scaleM) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }

      for (let x = widthHalf + ((minuteOffset - 1) * this.scale * scaleM); x >= 0; x -= this.scale * scaleM) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }
    }

    // Seconds
    if (this.scale > 1) {
      const ceil = ceilSecond(now);
      const secondOffset = subtractDate(ceil, now) / 1000;

      const style = 'white';
      const barHeight = 16;
      ctx.lineWidth = 1;
      ctx.strokeStyle = style;

      for (let x = widthHalf + (secondOffset * this.scale); x < width; x += this.scale) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }

      for (let x = widthHalf + ((secondOffset - 1) * this.scale); x >= 0; x -= this.scale) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }
    }

    // Milliseconds
    if (this.scale > 10) {
      const style = 'white';
      const barHeight = 2;
      ctx.lineWidth = 1;
      ctx.strokeStyle = style;

      for (let x = widthHalf; x < width; x += this.scale / 1000) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }

      for (let x = widthHalf; x >= 0; x -= this.scale / 1000) {
        ctx.beginPath();
        ctx.moveTo(x, heightHalf - barHeight / 2);
        ctx.lineTo(x, heightHalf + barHeight / 2)
        ctx.stroke();
      }
    }

    const barHeight = 50;
    ctx.lineWidth = 1;
    ctx.strokeStyle = `red`;
    ctx.beginPath();
    ctx.moveTo(widthHalf, heightHalf - barHeight / 2);
    ctx.lineTo(widthHalf, heightHalf + barHeight / 2)
    ctx.stroke();

    this.$clock!.innerHTML = formatDate(now);

    console.log(performance.now())
    console.log(new Date)
    console.log(new Date)
    console.log(performance.now())
  }
}

function ceilSecond(date: Date) {
  const clone = new Date(date);

  if (clone.getMilliseconds() == 0) {
    return clone;
  } else {
    clone.setMilliseconds(1000);
    return clone
  }
}

function ceilMinute(date: Date) {
  const clone = new Date(date);

  if (clone.getSeconds() == 0 && clone.getMilliseconds() == 0) {
    return clone;
  } else {
    clone.setSeconds(60);
    clone.setMilliseconds(0);
    return clone
  }
}

function ceilHour(date: Date) {
  const clone = new Date(date);

  if (clone.getMinutes() == 0 && clone.getSeconds() == 0 && clone.getMilliseconds() == 0) {
    return clone;
  } else {
    clone.setMinutes(60);
    clone.setSeconds(0);
    clone.setMilliseconds(0);
    return clone
  }
}

function ceilDate(date: Date) {
  const clone = new Date(date);

  if (clone.getHours() == 0 && clone.getMinutes() == 0 && clone.getSeconds() == 0 && clone.getMilliseconds() == 0) {
    return clone;
  } else {
    clone.setHours(24);
    clone.setMinutes(0);
    clone.setSeconds(0);
    clone.setMilliseconds(0);
    return clone
  }
}

function ceilMonth(date: Date) {
  const clone = new Date(date);

  if (clone.getDate() == 0 && clone.getHours() == 0 && clone.getMinutes() == 0 && clone.getSeconds() == 0 && clone.getMilliseconds() == 0) {
    return clone;
  } else {
    clone.setDate(24);
    clone.setHours(0);
    clone.setMinutes(0);
    clone.setSeconds(0);
    clone.setMilliseconds(0);
    return clone
  }
}

function subtractDate(a: Date, b: Date) {
  return a.getTime() - b.getTime();
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1, 2)}-${padZero(date.getDate(), 2)} ${padZero(date.getHours(), 2)}:${padZero(date.getMinutes(), 2)}:${padZero(date.getSeconds(), 2)}.${padZero(date.getMilliseconds(), 3)}`;
}

function padZero(number: number, digits: number) {
  return number.toString().padStart(digits, '0');
}