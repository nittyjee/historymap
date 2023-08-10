function SliderConstructor (min, max, preSelection) {
  [...arguments].forEach((date) => {
    if (typeof date !== 'string' || date.length !== 24) {
      const err = new Error('One or more of the dates provided does not appear to be an ISO-8601 string e.g. "1643-01-01T01:00:00.000Z"');
      throw err;
    }
  });

  const minDate = new Date(min);
  const minDateYear = minDate.getFullYear();

  const maxDate = new Date(max);
  const maxDateYear = maxDate.getFullYear();

  const checkBounds = new Date(preSelection);
  if (checkBounds < minDate || checkBounds > maxDate) {
    const err = new Error('Your preselected date is not between your min and max dates');
    throw err;
  }

  let load = false;
  // check rounding
  const step = (maxDateYear - minDateYear) / 10;
  const timeline = document.querySelector('.timeline');
  const slider = document.querySelector('.sliderHandle');
  const datePanel = document.querySelector('.datePanel');

  // REGARDING MOVING ACTION
  let isDown = false;
  let startX;
  let scrollLeft;
  let moveEvent;

  // REGARING DATE SELECTION ON MOVE
  const rulerPositionDimensions = () => {
    return document.querySelector('.timelineSlider').getBoundingClientRect();
  };
  const sliderPositionDimensions = () => {
    return slider.getBoundingClientRect();
  };
  const rulerWidth = () => {
    return rulerPositionDimensions().width;
  };

  const dateRange = dateDiffInDays(minDate, maxDate);

  const dayWidth = rulerWidth() / dateRange;

  const sliderCenterSelectionPosition = () => {
    return (sliderPositionDimensions().left - rulerPositionDimensions().x) + (sliderPositionDimensions().width / 2);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let selectedDateTimestamp;

  let selectedDate;

  /* PUBLIC METHODS */
  this.getDate = () => {
    return getSelection();
  };
  /* PUBLIC METHODS END */

  /* RENDER WIDGET */
  renderWidget(minDateYear, maxDateYear, step);

  function renderWidget (minDateYear, maxDateYear, step) {
    const steps = [];
    steps.push(Math.round(minDateYear += step));
    for (let i = 1; i < 10; i++) {
      if (i % 2 === 0) {
        steps.push(Math.round(minDateYear += step * 2));
      }
      if (i === 9) {
        makeDivs(steps);
      }
    }

		function makeDivs(steps) {
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

  /* PRIVATE METHODS */

  function dateDiffInDays (date1, date2) {
    function getUTCTime (dateStr) {
      const date = new Date(dateStr.toString());
      /* If use 'Date.getTime()' it doesn't compute the right amount of days
      if there is a 'day saving time' change between dates. */
      return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const date1Time = getUTCTime(date1);
    const date2Time = getUTCTime(date2);
    if (!date1Time || !date2Time) return 0;
    return Math.round((date2Time - date1Time) / (24 * 60 * 60 * 1000));
  }

  function getSelection (key) {
    // gets the currently selected day from start:
    const currentSelection = () => {
      return sliderCenterSelectionPosition() / dayWidth;
    };

    // sets the slider position:
    function setSliderSliderPosition () {
      const daysSinceStart = dateDiffInDays(minDate, selectedDate);
      const px = (dayWidth * daysSinceStart) - (sliderPositionDimensions().width / 2);
      slider.style.left = `${px}px`;
    }

    // writes date to date panel
    function writeToDiv (selection) {
      datePanel.textContent = formatDate(selection, 'string');
    }
    // if a mouse or a touch event:
    if (!key) {
      // onload, if a pre selected value is chosen;
      if (preSelection && !load) {
        selectedDateTimestamp = new Date(preSelection).getTime();
        load = true;
      } else {
        selectedDateTimestamp = new Date(min).setDate(currentSelection());
      }
    // if a keyboard event:
    } else {
      selectedDateTimestamp += (key * 24 * 60 * 60 * 1000);
    }

    selectedDate = new Date(selectedDateTimestamp);

    if (selectedDate > maxDate || selectedDate < minDate) {
      return;
    }
    const dateFormatMapbox = formatDate(selectedDate);
    setSliderSliderPosition();
    writeToDiv(dateFormatMapbox);
    layerControls.addDateFilter(dateFormatMapbox, dateFormatMapbox);
    return dateFormatMapbox;
  }

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

  // On drag start
  function start (e) {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.offsetLeft;
    // attach event
    toggleMove();
  }

  function move (e) {
    // if mouse is moving but not dragging slider
    if (!isDown) return;
    const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
    const y = e.pageY || e.touches[0].pageY;
    const dist = (x - startX);
    const px = scrollLeft + dist;
    // if (px > -14) {
    if (x > rulerPositionDimensions().left &&
      x < rulerPositionDimensions().right &&
      y < rulerPositionDimensions().bottom &&
      y > rulerPositionDimensions().top) {
      slider.style.left = `${px}px`;
      getSelection();
    }
  }

  /* On drag end */
  function end (e) {
    // remove event:
    toggleMove();
    isDown = false;
    slider.classList.remove('active');
  }

  // formats the date to the required form to query map features:
  function formatDate (selection, returnIntOrSt) {
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
      // return `${rawDay}${stNdRdTh(rawDay)} ${months[rawMonth]} ${date.getFullYear()}`;
      return `${rawDay} ${months[rawMonth]} ${date.getFullYear()}`;
    }
    return parseInt(`${date.getFullYear()}${month}${day}`);
  }

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      getSelection(1);
    }
    if (e.key === 'ArrowLeft') {
      getSelection(-1);
    }
  });

  timeline.addEventListener('mouseover', (e) => {
    slider.classList.add('redSlider');
  });

  timeline.addEventListener('mouseout', (e) => {
    slider.classList.remove('redSlider');
  });
  /* EVENTS END */
}
