var urlApi = 'http://157.230.17.132:3014/todos';
var $wrapperList = $('.wrapper-list');
var $button = $('#my-button');
var $input = $('#insert');
var $inputDate = $('#date');
var $inputTime = $('#time');
var $alert = $('.alert');
var date = moment().format('YYYY-MM-DD');
var time = moment().format('hh:mm');

$(document).ready(function(){
  console.log(date);

  $inputDate.val(date);
  $inputTime.val(time);

  getData(urlApi);

  $button.click(function(){
    var thisText = $input.val();
    var thisDate = $inputDate.val();
    var thisTime = $inputTime.val();

    var obj = {
      'text': thisText,
      'time': thisTime,
      'date': thisDate
    };

    if (thisText != '') {
      createData(urlApi, obj);
      $input.val('');
    } else {
      printError($alert,'Attenzione devi inserire un testo');
    }
  });

  $(document).on('click', '.delete', function(){
    var id = $(this).parent('.list__item').attr('data-id');
    deleteData(urlApi, id);
  });

  $(document).on('click', '.list__text', function(){
    var $listItems = $('.list__item');
    var $thisItem = $(this).parent('.list__item');
    var $thisInput = $(this);
    var $InputDate = $thisItem.children('.list__date');
    var $InputTime = $thisItem.children('.list__time');
    var thisText = $thisInput.val();
    var thisDate = $InputDate.val();
    var thisTime = $InputTime.val();

    var id = $thisItem.attr('data-id');

    $thisInput.keyup(function(event){
      //se premo invio chiamo invio i nuovi dati
      if(event.keyCode == 13){

        var newText = $thisInput.val();
        var obj = {
          'text': newText,
          'time': thisTime,
          'date': thisDate
        };
        if(newText != ''){
          //console.log('invio');
          modifyData(urlApi, obj, id);
          $thisItem.removeClass('active');
        } else {
          //console.log('errore');
          $thisInput.removeClass('active');

          printError($alert, 'Attenzione non hai inserito un testo');
          $thisInput.attr('placeholder', thisText);
        }

      }
      else if (event.keyCode == 27){
        $thisInput.val(thisText);
        deleteHtml($alert);
      }

    });
  });

});

$(document).on('click', '.list__time', function(){
  var $listItems = $('.list__item');
  var $thisItem = $(this).parent('.list__item');
  var $thisInput = $(this);
  var $InputDate = $thisItem.children('.list__date');
  var $InputText = $thisItem.children('.list__text');
  var thisTime = $thisInput.val();
  var thisText = $InputText.val();
  var thisDate = $InputDate.val();

  var id = $thisItem.attr('data-id');

  $thisInput.keyup(function(event){
    //se premo invio chiamo invio i nuovi dati
    if(event.keyCode == 13){
      //alert('click');
      var thisValue = $thisInput.val();
      if(!thisValue){
        $thisInput.val(time);
        var obj = {
          'text': thisText,
          'time': thisTime,
          'date': thisDate
        };
        modifyData(urlApi, obj, id);
        $thisItem.removeClass('active');
      } else {
        alert('click');
        console.log(thisValue);
        var objTime = {
          'time': thisValue
        };
        modifyData(urlApi, objTime, id);
      }
    }

  });

});


$(document).on('click', '.list__date', function(){
  var $listItems = $('.list__item');
  var $thisItem = $(this).parent('.list__item');
  var $thisInput = $(this);
  var $InputTime = $thisItem.children('.list__time');
  var $InputText = $thisItem.children('.list__text');
  var thisTime = $InputTime.val();
  var thisText = $InputText.val();
  var thisDate = $thisInput.val();


  var id = $thisItem.attr('data-id');

  $thisInput.keyup(function(event){
    //se premo invio chiamo invio i nuovi dati
    if(event.keyCode == 13){
      //alert('click');
      var thisValue = $thisInput.val();
      if(!thisValue){
        $thisInput.val(date);
        var obj = {
          'text': thisText,
          'time': thisTime,
          'date': thisDate
        };
        modifyData(urlApi, obj, id);
        $thisItem.removeClass('active');
      } else {
        alert('click');
        console.log(thisValue);
        var objTime = {
          'date': thisValue
        };
        modifyData(urlApi, objTime, id);
      }
    }

  });

});

//funzione che fa chiamata get
function getData(urlApi){
  $.ajax({
    url: urlApi,
    method: 'GET',
    success: function(data){
      console.log(data);
      printData(data);
    },
    error: function(err){
      printError($alert, err);
    }
  });
}

function createData(urlApi, obj){
  $.ajax({
    url: urlApi,
    method: 'POST',
    data: obj,
    success: function(data){
      getData(urlApi);
    },
    error: function(err){
      printError($alert, err);
    }
  });
}

function modifyData(urlApi, obj, id){
  console.log(obj);
  $.ajax({
    url: urlApi + '/' + id,
    method: 'PATCH',
    data: obj,
    success: function(data){
      console.log(data);
      getData(urlApi);
    },
    error: function(err){
      printError($alert, err);
    }
  });
}

function deleteData(urlApi, id){
  $.ajax({
    url: urlApi + '/' + id,
    method: 'DELETE',
    success: function(data){
      console.log(data);
      getData(urlApi);
    },
    error: function(err){
      printError($alert, err);
    }
  });
}

//stampa i dati
function printData(obj){
  console.log(obj);

  var templateListSource = $('#template-list').html();
  var templateListCompiled = Handlebars.compile(templateListSource);

  deleteHtml($alert);
  deleteHtml($wrapperList);

  var listTemplate = createTemplate(obj, templateListCompiled);

  insertHtml($wrapperList, listTemplate);
}

//ritorna html da inserire
function createTemplate(obj, compiled) {
  var objData = {
    item:[]
  };

  //creo oggetto per handlebars
  for (var i = 0; i < obj.length; i++) {
    objData.item[i] = {
      'id': obj[i].id,
      'text': obj[i].text,
      'time' : obj[i].time,
      'date' : obj[i].date
    };
  }
 return compiled(objData);
}

//funzione che svuota un contenitore html
function deleteHtml(domElement){
  domElement.html('');
}

//funzione che inserisce html in contenitore
function insertHtml(domElement, children){
  domElement.html(children);
}

//funzione che stampa un errore in un contenitore
function printError(domElement, error){
  insertHtml(domElement, error);
}

function resetItem(item, text){
  console.log(item);
  console.log(text);
  item.val(text);
}
