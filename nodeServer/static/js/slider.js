function SliderConstructor (minDate, maxDate) {
  this.getDate = () => {
    const selection = getSelection();
    return getDate(selection);
  };

  this.dateTransform = (date) => {
    return getDate(date);
  };

  this.returnMinDate = () => {
    // whatever position the selector is at:
    return getDate();
  };

  this.returnMaxDate = () => {
    return getDate(maxDate);
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

  const MS_PER_SEC = 1000;
  const SEC_PER_HR = 60 * 60;
  const HR_PER_DAY = 24;
  const MS_PER_DAY = MS_PER_SEC * SEC_PER_HR * HR_PER_DAY;

  function dateDiffInDays (date1, date2) {
    const date1Time = getUTCTime(date1);
    const date2Time = getUTCTime(date2);
    if (!date1Time || !date2Time) return 0;
    return Math.round((date2Time - date1Time) / MS_PER_DAY);
  }

  function getUTCTime (dateStr) {
    const date = new Date(dateStr.toString());
    // If use 'Date.getTime()' it doesn't compute the right amount of days
    // if there is a 'day saving time' change between dates
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays (date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function getSelection () {
    const width = document.querySelector('.timelineSlider').clientWidth;
    const position = parseFloat(slider.offsetLeft);

    const dateRange = maxDate - minDate;
    const dateRangeDisplay = dateDiffInDays(minDate, maxDate);

    const dayWidth = width / dateRange;
    const dayWidthDisplay = width / dateRangeDisplay;

    const selectionDisplay = Math.round(minDate + (position / dayWidthDisplay));
    const prettyPrint = addDays(minDate.toString(), selectionDisplay);

    // internal
    const selection = Math.round(minDate + (position / dayWidth));

    const day = prettyPrint.getDate();
    const month = prettyPrint.getMonth();
    const year = prettyPrint.getFullYear();
    // this should be placed outside this constructor:
    document.querySelector('.datePanel').textContent = `${day}${stNdRdTh(day)} ${months[month]} ${year}`;
    //getDate(selection, 'string');
    // ditto
    layerControls.addDateFilter(getDate(selection), getDate(maxDate));
    return selection;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const stNdRdTh = (number) => {
    const postFix = ['st', 'nd', 'rd', 'th'];
    const exceptions = [11, 12, 13, 0];
    const length = number.toString().length;
    if (length > 1) {
      const lastDigit = parseInt(number.toString()[1]);
      if (exceptions.includes(lastDigit) || lastDigit > 3) {
        return postFix[3];
      }
      return postFix[parseInt(number.toString()[1]) - 1];
    }
    if (parseInt(number.toString()[0]) > 4) {
      return postFix[3];
    }
    return postFix[parseInt(number.toString()[0]) - 1];
  };

  function getDate (selection, returnIntOrSt) {
    selection = (typeof selection === 'number')
      ? selection.toString()
      : selection;

    let format;
    if (selection.length > 4) {
      format = selection.split('');
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
    if (returnIntOrSt === 'string') {
      return `${rawDay}${stNdRdTh(rawDay)} ${months[rawMonth]} ${date.getFullYear()}`;
    }
    return parseInt(`${date.getFullYear()}${month}${day}`);
  }

  let moveEvent;
  function toggleMove () {
    if (moveEvent) {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      moveEvent = true;
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move);
    moveEvent = false;
  }

  const start = (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.offsetLeft;
    toggleMove();
  };

  const move = (e) => {
    if (!isDown) return;
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const dist = (x - startX);
    slider.style.left = `${scrollLeft + dist}px`;
    getSelection();
  };

  const end = (e) => {
    toggleMove();
    isDown = false;
    slider.classList.remove('active');
  };

  timeline.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    slider.style.left = `${startX - 30}px`;
    getSelection();
  });

  slider.addEventListener('mousedown', start);
  slider.addEventListener('touchstart', start);

  slider.addEventListener('mouseup', end);
  slider.addEventListener('touchend', end);
}
