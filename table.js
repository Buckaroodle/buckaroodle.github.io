/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   sortable-table.js
 *
 *   Desc:   Adds sorting to a HTML data table that implements ARIA Authoring Practices
 */

'use strict';

class SortableTable {
  constructor(tableNode) {
    this.tableNode = tableNode;

    this.columnHeaders = tableNode.querySelectorAll('thead th');

    this.sortColumns = [];

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var buttonNode = ch.querySelector('button');
      if (buttonNode) {
        this.sortColumns.push(i);
        buttonNode.setAttribute('data-column-index', i);
        buttonNode.addEventListener('click', this.handleClick.bind(this));
      }
    }

    this.optionCheckbox = document.querySelector(
      'input[type="checkbox"][value="show-unsorted-icon"]'
    );

    if (this.optionCheckbox) {
      this.optionCheckbox.addEventListener(
        'change',
        this.handleOptionChange.bind(this)
      );
      if (this.optionCheckbox.checked) {
        this.tableNode.classList.add('show-unsorted-icon');
      }
    }
  }

  setColumnHeaderSort(columnIndex) {
    if (typeof columnIndex === 'string') {
      columnIndex = parseInt(columnIndex);
    }

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var buttonNode = ch.querySelector('button');
      if (i === columnIndex) {
        var value = ch.getAttribute('aria-sort');
        if (value === 'descending') {
          ch.setAttribute('aria-sort', 'ascending');
          this.sortColumn(
            columnIndex,
            'ascending',
            ch.classList.contains('num')
          );
        } else {
          ch.setAttribute('aria-sort', 'descending');
          this.sortColumn(
            columnIndex,
            'descending',
            ch.classList.contains('num')
          );
        }
      } else {
        if (ch.hasAttribute('aria-sort') && buttonNode) {
          ch.removeAttribute('aria-sort');
        }
      }
    }
  }

  sortColumn(columnIndex, sortValue, isNumber) {
    function compareValues(a, b) {
        if (sortValue === 'ascending') {
            if (a.value === b.value) {
                return 0;
            } else {
                if (a.isDate || a.isDay) {
                    return a.value - b.value;
                } else if (isNumber) {
                    return a.value - b.value;
                } else {
                    return a.value < b.value ? -1 : 1;
                }
            }
        } else {
            if (a.value === b.value) {
                return 0;
            } else {
                if (a.isDate || a.isDay) {
                    return b.value - a.value;
                } else if (isNumber) {
                    return b.value - a.value;
                } else {
                    return a.value > b.value ? -1 : 1;
                }
            }
        }
    }

    var isDate = this.columnHeaders[columnIndex].classList.contains('date');
    var isDay = this.columnHeaders[columnIndex].classList.contains('difficulty');

    if (typeof isNumber !== 'boolean') {
        isNumber = false;
    }

    var tbodyNode = this.tableNode.querySelector('tbody');
    var rowNodes = [];
    var dataCells = [];

    var rowNode = tbodyNode.firstElementChild;

    var index = 0;
    while (rowNode) {
        rowNodes.push(rowNode);
        var rowCells = rowNode.querySelectorAll('th, td');
        var dataCell = rowCells[columnIndex];

        var data = {};
        data.index = index;
        data.isDate = isDate;
        data.isDay = isDay;

        if (isDate) {
            var dateParts = dataCell.textContent.split('/');
            if (dateParts.length === 3) {
                var month = parseInt(dateParts[0]) - 1;
                var day = parseInt(dateParts[1]);
                var year = parseInt(dateParts[2]);
                if (year < 100) {
                  year += 2000;
                }
                data.value = new Date(year, month, day);
            } else {
                data.value = null;
            }
        } else if (isDay) {
            // Day mapping
            var dayMap = {
                'monday': 1,
                'tuesday': 2,
                'wednesday': 3,
                'thursday': 4,
                'friday': 5,
                'saturday': 6,
                'sunday': 7
            };
            data.value = dayMap[dataCell.textContent.toLowerCase().trim()] || 0; // Default to 0 if day is not found
        } else {
            data.value = dataCell.textContent.toLowerCase().trim();
            if (isNumber) {
                data.value = parseFloat(data.value);
            }
        }
        dataCells.push(data);
        rowNode = rowNode.nextElementSibling;
        index += 1;
    }

    dataCells.sort(compareValues);

    while (tbodyNode.firstChild) {
        tbodyNode.removeChild(tbodyNode.lastChild);
    }

    for (var i = 0; i < dataCells.length; i += 1) {
        tbodyNode.appendChild(rowNodes[dataCells[i].index]);
    }
}

  /* EVENT HANDLERS */

  handleClick(event) {
    var tgt = event.currentTarget;
    this.setColumnHeaderSort(tgt.getAttribute('data-column-index'));
  }

  handleOptionChange(event) {
    var tgt = event.currentTarget;

    if (tgt.checked) {
      this.tableNode.classList.add('show-unsorted-icon');
    } else {
      this.tableNode.classList.remove('show-unsorted-icon');
    }
  }
}

// Initialize sortable table buttons
window.addEventListener('load', function () {
  var sortableTables = document.querySelectorAll('table.sortable');
  for (var i = 0; i < sortableTables.length; i++) {
    new SortableTable(sortableTables[i]);
  }
});