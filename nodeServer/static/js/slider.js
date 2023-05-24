function SliderConstructor (minDate, maxDate) {
  this.getDate = () => {
    const selection = getSelection();
    return getDate (selection);
  };

  this.returnMinDate = () => {
    // whatever position the selector is at:
    return getDate ();
  };

  this.returnMaxDate = () => {
    return getDate (maxDate);
  };
  // check rounding
  const step = (maxDate - minDate) / 10;
  const timeline = document.querySelector('.timeline');
  const slider = document.querySelector('.sliderHandle');

  let isDown = false;
  let startX;
  let scrollLeft;

  timeline.addEventListener('mouseover', (e) => {
    slider.classList.add('redSlider');
  });

  timeline.addEventListener('mouseout', (e) => {
    slider.classList.remove('redSlider');
  });

  makeYears(minDate, maxDate, step);

  function makeYears (minDate, maxDate, step) {
    const steps = [];
    steps.push(Math.round(minDate += step));
    for (let i = 1; i < 10; i++) {
      if (i % 2 === 0) {
        steps.push(Math.round(minDate += step * 2));
      }
      if (i === 9) {
        makeDivs(steps);
      }
    }

    function makeDivs (steps) {
      for (let i = 0; i < steps.length; i++) {
        const year = document.createElement('div');
        year.classList.add('year');
        year.textContent = steps[i];
        timeline.appendChild(year);

        const yearCarat = document.createElement('span');
        yearCarat.classList.add('yearCarat');
        year.appendChild(yearCarat);
      }
    }
  }

  function getSelection () {
    const width = document.querySelector('.timelineSlider').clientWidth;
    const position = parseFloat(slider.offsetLeft);
    const dateRange = maxDate - minDate;
    const yearWidth = width / dateRange;
    const selection = Math.round(minDate + (position / yearWidth));
    // this should be placed outside this constructor:
    document.querySelector('.datePanel').textContent = selection;
    // ditto
    layerControls.addDateFilter(getDate(selection), getDate(maxDate));
    return selection;
  }

  function getDate (selection) {
    selection = (typeof selection === 'number')
      ? selection.toString()
      : selection;

    let format;
    if (selection.length > 4) {
      let format = selection.split('');
      format.splice(4, 0, '/');
      format.splice(7, 0, '/');
      format = format.join('');
    } else {
      format = selection;
    }

    const date = new Date(format);
    if (!date.valueOf()) {
      console.error(`Invalid date ${selection} passed to "getDate()"
      getDate() expects a string formated YYYYMMDD.`);
      return;
    }
    const rawMonth = date.getMonth();
    const month = ((rawMonth + 1).toString().length === 1)
      ? `0${rawMonth + 1}`
      : `${rawMonth + 1}`;

    const rawDay = date.getDate();
    const day = ((rawDay).toString().length === 1)
      ? `0${rawDay}`
      : `${rawDay}`;
    return parseInt(`${date.getFullYear()}${month}${day}`);
  }

  const start = (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.offsetLeft;
  };

  const move = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const dist = (x - startX);
    slider.style.left = `${scrollLeft + dist}px`;
    getSelection();
  };

  const end = () => {
    isDown = false;
    slider.classList.remove('active');
  };

  slider.addEventListener('mousedown', start);
  slider.addEventListener('touchstart', start);

  slider.addEventListener('mousemove', move);
  slider.addEventListener('touchmove', move);

  slider.addEventListener('mouseleave', end);
  slider.addEventListener('mouseup', end);
  slider.addEventListener('touchend', end);
}
