$(document).ready(function () {
  var table = $("#TableFromDatas").DataTable({
    order: [],
    language: {
      info: "",
      search: "",
      zeroRecords: "No results found.",
      infoFiltered: "",
      infoEmpty: "",
    },
    dom: "Bfrtip",
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: function () {
          return ($("#custom-csv").data("filename") + "_" + new Date().toISOString());
        },
      },
      {
        extend: "excel",
        text: "Excel",
        filename: function () {
          return ($("#custom-excel").data("filename") + "_" + new Date().toISOString());
        },
      },
      {
        extend: "pdf",
        text: "PDF",
        filename: function () {
          return ($("#custom-pdf").data("filename") + "_" + new Date().toISOString());
        },
      },
    ],
    pageLength: parseInt( document.querySelector(".totalLeng").getAttribute("data-page-length"), 10 ),
    lengthChange: false,
    footerCallback: function (row, data, start, end, display) {
      var api = this.api();
      var filteredCount = api.rows({ search: "applied" }).data().length;
      $("#filteredCount").html(filteredCount);
      if (filteredCount > 0) {
        $("#tableFooter").css("visibility", "visible");
      } else {
        $("#tableFooter").css("visibility", "hidden");
      }
    },
    order: [],
    createdRow: function (row, data, dataIndex) {
      var orderColumnIndex = $(row).data("order-column");
      var orderNumber = dataIndex + 1;
      $("td:eq(" + orderColumnIndex + ")", row).html(orderNumber);
    },
    drawCallback: function (settings) {
      var api = this.api();
      $("#paginationStart").text(api.page.info().start + 1);
      $("#paginationEnd").text(api.page.info().end);
      $("#paginationTotal").text(api.page.info().recordsTotal);
      var currentPage = api.page.info().page + 1;
      var totalPages = api.page.info().pages;
      var paginationNumbers = "";
      if (totalPages <= 7) {
        for (var i = 1; i <= totalPages; i++) {
          paginationNumbers += '<span class="pagination-number" data-page="' + i + '">' + i + "</span>";
        }
      } else {
        var startPage = Math.max(currentPage - 3, 1);
        var endPage = Math.min(startPage + 6, totalPages);
        if (startPage > 1) {
          paginationNumbers += '<span class="pagination-number" data-page="1">1</span>';
          if (startPage > 2) {
            paginationNumbers += '<span class="pagination-number">...</span>';
          }
        }
        for (var i = startPage; i <= endPage; i++) {
          paginationNumbers += '<span class="pagination-number" data-page="' + i + '">' + i + "</span>";
        }
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            paginationNumbers += '<span class="pagination-number">...</span>';
          }
          paginationNumbers += '<span class="pagination-number" data-page="' + totalPages + '">' + totalPages + "</span>";
        }
      }
      $("#pagination-numbers").html(paginationNumbers);
    },
  });
  $("#prev-button").on("click", function () {
    table.page("previous").draw("page");
  });
  $("#next-button").on("click", function () {
    table.page("next").draw("page");
  });
  $(document).on("click", ".pagination-number", function () {
    var page = $(this).data("page");
    table.page(page - 1).draw("page");
  });
  $("#LargeFilters").on("keyup", function () {
    var textValue = $(this).val();
    table.search(textValue).draw();
  });
  $("#SelectFilters").on("change", function () {
    var selectedValue = $(this).val();
    table.search(selectedValue).draw();
  });
  $("#custom-csv").on("click", function () {
    table.button(".buttons-csv").trigger();
  });
  $("#custom-excel").on("click", function () {
    table.button(".buttons-excel").trigger();
  });
  $("#custom-pdf").on("click", function () {
    table.button(".buttons-pdf").trigger();
  });

  $("#export-options").on("change", function () {
    var selectedOption = $(this).val();
    var filename = "my_file_";

    if (selectedOption === "csv") {
      filename = "my_file_name_csv_" + new Date().toISOString() + ".csv";
      table.button(".buttons-csv").trigger({ filename: filename });
    } else if (selectedOption === "excel") {
      filename = "my_file_name_excel_" + new Date().toISOString() + ".xlsx";
      table.button(".buttons-excel").trigger({ filename: filename });
    } else if (selectedOption === "pdf") {
      filename = "my_file_name_pdf_" + new Date().toISOString() + ".pdf";
      table.button(".buttons-pdf").trigger({ filename: filename });
    }
  });
});

(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      var forms = document.getElementsByClassName("laodForm");
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );

  const select = (el, all = false) => {
    el = el.trim();
    return all
      ? [...document.querySelectorAll(el)]
      : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const elements = select(el, all);
    if (all) {
      elements.forEach((e) => e.addEventListener(type, listener));
    } else {
      elements.addEventListener(type, listener);
    }
  };

  if (select(".toggle-sidebar-btn")) {
    on("click", ".toggle-sidebar-btn", (e) => {
      select("body").classList.toggle("toggle-sidebar");
    });
  }
})();

function CountTableLigne() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const compteur = document.getElementById("compteur");
  let nbreLignes = 0;
  checkboxes.forEach((checkbox, index) => {
    if (index > 0 && checkbox.checked) {
      nbreLignes++;
    }
  });
  compteur.textContent = nbreLignes;
}

document.addEventListener("DOMContentLoaded", function() {
  const selectAll = document.getElementById("checkall");
  if (selectAll) {
    selectAll.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const isChecked = selectAll.checked;
      checkboxes.forEach((checkbox, index) => {
        if (index > 0) {
          checkbox.checked = isChecked;
        }
      });
      CountTableLigne();
    });
  }
});

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((checkbox, index) => {
  if (index > 0) {
    checkbox.addEventListener("change", CountTableLigne);
  }
});

$(document).ready(function () {
  $("#checkall").click(function () {
    if ($(this).is(":checked")) {
      $(".checkitem").prop("checked", true);
    } else {
      $(".checkitem").prop("checked", false);
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const selectAll = document.getElementById("checkall");
  if (selectAll) {
    selectAll.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const isChecked = selectAll.checked;
      checkboxes.forEach((checkbox, index) => {
        if (index > 0) {
          checkbox.checked = isChecked;
          toggleRowColor(checkbox);
        }
      });
      CountTableLigne();
    });
  }
});

checkboxes.forEach((checkbox, index) => {
  if (index > 0) {
    checkbox.addEventListener("change", function () {
      toggleRowColor(checkbox);
      CountTableLigne();
    });
  }
});

function toggleRowColor(checkbox) {
  var row = checkbox.closest("tr");
  row.classList.toggle("selected", checkbox.checked);
}

function onlyChaines(chars) {
  var regex = new RegExp("[a-zA-Zàâäçéèêëîïôö'ùûüæœ\\s-]", "i");
  var valid = "";
  for (var x = 0; x < chars.value.length; x++) {
    valid = regex.test(chars.value.charAt(x));
    if (!valid) {
      chars.value = chars.value.substr(0, x) + chars.value.substr(x + 1);
      x--;
    }
  }
}

function onlyNumeric(chars) {
  var regex = new RegExp("[0-9]", "i");
  var valid = "";
  for (var x = 0; x < chars.value.length; x++) {
    valid = regex.test(chars.value.charAt(x));
    if (!valid) {
      chars.value = chars.value.substr(0, x) + chars.value.substr(x + 1);
      x--;
    }
  }
}

function mixed(chars) {
  var regex = new RegExp("[a-zA-Z0-9àâäçéèêëîïôö'ùûüæœ\\s-]", "i");
  var valid = "";
  for (var x = 0; x < chars.value.length; x++) {
    valid = regex.test(chars.value.charAt(x));
    if (!valid) {
      chars.value = chars.value.substr(0, x) + chars.value.substr(x + 1);
      x--;
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const input = document.querySelector("input");
  if (input) {
    const maxLength = input.getAttribute("maxlength");
    input.addEventListener("input", (event) => {
      const valueLength = event.target.value.length;
      const leftCharLength = maxLength - valueLength;
      if (leftCharLength < 0) return;
    });
  }
});

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

function filterForm() {
  document.filter.submit();
}

$(".select2").select2();

function submitActions() {
  document.ifSendDatas.submit();
}

function submitForm() {
  document.getElementById("submitForm").submit();
}

document.addEventListener("DOMContentLoaded", function() {
  const btnValidate = document.getElementById("BtnValidate");
  if (btnValidate) {
    btnValidate.addEventListener("click", function () {
      const errorMessage = document.getElementById("errorMessage");
      const inputFile = document.getElementById("file");
      if (inputFile && inputFile.files.length > 0) {
        const file = inputFile.files[0];
        const fileSize = file.size;
        const maxSize = parseInt(inputFile.dataset.maxSize, 10);
        if (fileSize > maxSize) {
          errorMessage.textContent =
            "The file size exceeds the allowed limit of " + maxSize / 1024 + " ko.";
          inputFile.value = "";
        }
      }
    });
  }
});