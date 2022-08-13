// When the user scrolls the page, execute myFunction
window.onscroll = function () { myFunction() };

// Get the header
var header = document.getElementById("header");

// Get the offset position of the navbar
if (header != undefined)
{
  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  var sticky = header.offsetTop;
}

function myFunction()
{
  if (window.pageYOffset > sticky)
  {
    header.classList.add("navbar__sticky");
    header.classList.add("bg-white");
  } else
  {
    header.classList.remove("navbar__sticky");
    header.classList.remove("bg-white");
  }
}


function preventBack()
{
  window.history.forward();
}

$(document).ready(function ()
{

  $('.card-quantity').bind('click keyup', function(){
    var selectedtype = $('.card-select-type').val();
    updatePrice()
  });

  $('.card-price').change(function(){
    updatePrice()
  })


  setTimeout("preventBack()", 0);
  //Check if admin page and call api
  var isAdminUserPage = $('.admin-user-page')
  var isAdminTransactionPage = $('#admin-transaction')
  var emailVal = $('.email-upload')
  if (emailVal != undefined)
  {
    emailVal.hide()
  }
  if (isAdminUserPage.length > 0)
  {
    getAccountList()
  }
  if (isAdminTransactionPage.length > 0)
  {
    getTransactionList()
  }

  //Check select option in admin-user
  $('.user-selection').change(function ()
  {
    var selected = $('.user-selection').val();
    if (selected == "All")
    {
      $("#admin-user-tbody").empty();
      getAccountList()
    }
    else
    {
      $("#admin-user-tbody").empty();
      getAccountListByStatus(selected)
    }
  });

  //Check select option in admin-transaction
  $('.transac-selection').change(function ()
  {
    var selected = $('.transac-selection').val();
    if (selected == "All")
    {
      $("#admin-transaction-tbody").empty();
      getTransactionList()
    }
    else
    {
      $("#admin-transaction-tbody").empty();
      getTransactionsByStatus(selected)
    }
  });

  //Activate account admin permission
  $(".btn-stt-activate").click(function ()
  {
    var email = $('.user-filter').attr("data-email")
    var status = "Activated"
    console.log(email, status)
    updateAccountStatus(email, status)
  })

  //Deactivate account admin permission
  $(".btn-stt-deactivate").click(function ()
  {
    var email = $('.user-filter').attr("data-email")
    var status = "Deactivated"
    updateAccountStatus(email, status)
  })

  //Unlock account admin permission
  $(".btn-unlock-account").click(function ()
  {
    var email = $('.user-filter').attr("data-email")
    var status = "Activated"
    console.log(email, status)
    updateAccountStatus(email, status)
  })

  //Request infomation admin permission
  $('.btn-stt-request').click(function ()
  {
    var email = $('.user-filter').attr("data-email")
    var status = "Updating"
    updateAccountStatus(email, status)
  })

  //Services ul li click
  $(".ann-role").on("click", function (event)
  {
    var role = $('.service-wrapper').attr("data-status")
    if (role == "Pending" || role == "Updating")
    {
      console.log("OKe")
      $('#NotUserStatus').modal('show')
    }
  });

  $(".submit-recharge").on("click", function (event)
  {
    const typeTrans = "Recharge"
    var role = $('.service-wrapper').attr("data-status")
    if (role == "Pending" || role == "Updating")
    {
      $('#NotUserStatus').modal('show')
    }
    else
    {

      if (rechargeValidate() == false)
      {
        return false;
      } else
      {
        var amount = $('input[name=recharge-amount]').val()
        var card = $('input[name=recharge-cardnumber]').val()
        var expiry = $('input[name=recharge-expirydate]').val()
        var cvv = $('input[name=recharge-cvvnumber]').val()
        var note = "CASHIN"
        sendTransaction(typeTrans, amount, card, expiry, cvv, note)
      }

    }
  })

  $(".submit-withdraw").on("click", function (event)
  {
    const typeTrans = "Withdraw"
    var role = $('.service-wrapper').attr("data-status")
    if (role == "Pending" || role == "Updating")
    {
      $('#NotUserStatus').modal('show')
    }
    else
    {
      if (withdrawValidate() == false)
      {
        return;
      } else
      {
        var amount = $('input[name=withdraw-amount]').val()
        var card = $('input[name=withdraw-cardnumber]').val()
        var expiry = $('input[name=withdraw-expirydate]').val()
        var cvv = $('input[name=withdraw-cvvnumber]').val()
        var note = $('input[name=withdraw-note]').val()
        sendTransaction(typeTrans, amount, card, expiry, cvv, note)
      }



    }
  })

  $(".submit-transfer").on("click", function (event)
  {
    var role = $('.service-wrapper').attr("data-status")
    if (role == "Pending" || role == "Updating")
    {
      $('#NotUserStatusl').modal('show')
    }
    else
    {
      var email = $('#transferTab').attr('data-email')
      getOTP(email)
      $(".strong-text").text(email)
      //
    }
  })

  $(".btn-service-otp").click(function ()
  {
    var digitMono = $('input[name=digitMono]').val()
    var digitDi = $('input[name=digitDi]').val()
    var digitTri = $('input[name=digitTri]').val()
    var digitTetra = $('input[name=digitTetra]').val()
    var digitPenta = $('input[name=digitPenta]').val()
    var digitHexa = $('input[name=digitHexa]').val()
    const code = digitMono + digitDi + digitTri + digitTetra + digitPenta + digitHexa
    $.ajax({
      async: false,
      url: "http://localhost:3000/user/verify",
      type: "POST",
      data: JSON.stringify({ code }),
      dataType: 'json',
      processData: false,
      crossDomain: true,
      contentType: "application/json",
      success: function (response)
      {

        if (response.error.length > 0)
        {
          $('#otpModal').modal('hide')
          $('#alert-error').html(error)
        }
        if (response.success)
        {
          var receiver = $('input[name=receiver]').val()
          var feeler = $("#bearer-select option:selected").val()
          var amount = $('input[name=transfer-amount]').val()
          var note = $('input[name=transfer-note]').val()
          transferMoney(receiver, feeler, amount, note)
        }
      },
    })
  })

  $(".submit-buycard").on("click", function (event)
  {
    var role = $('.service-wrapper').attr("data-status")
    if (role == "Pending" || role == "Updating")
    {
      $('#NotUserStatus').modal('show')
    }
    else{
      var price = $('.card-price').val();
      var quantity = $(".card-quantity").val();
      var type = $('.card-select-type').val();
      var total = Number(price) * Number(quantity)
      getCardTransaction(price, quantity, type, total)
    }
  })

  //Username and password modal config
  var username = $('.account-username').text()
  var password = $('.account-password').text()
  if (!($('.account-username').is(':empty') && $('.account-password').is(':empty')))
  {
    $('#successfullRegisterModal').modal('show')
  }

  $(".password--wrapper").click(function ()
  {
    console.log("Onclick")
    $(this).find('input.dot-start').focus();
  })

  $(".password-dots").keyup(function ()
  {
    var key = event.keyCode || event.charCode;
    if (this.value.length == this.maxLength)
    {
      $(this).next('.password-dots').focus();
    }
    var inputs = $('input.password-dots');
    if (($(this).val().length === this.maxLength) && key != 32)
    {
      inputs.eq(inputs.index(this) + 1).focus();
    }
    if (key == 8 || key == 46)
    {
      var indexNum = inputs.index(this);
      if (indexNum != 0)
      {
        inputs.eq(inputs.index(this) - 1).val('').focus();
      }
    }
  });
})


// Preview Upload Img in Register

function previewFrontImg(input)
{
  if (input.files && input.files[0])
  {
    var reader = new FileReader();

    reader.onload = function (e)
    {
      $('#registerFrontImg')
        .attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewBackImg(input)
{
  if (input.files && input.files[0])
  {
    var reader = new FileReader();

    reader.onload = function (e)
    {
      $('#registerBackImg')
        .attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

$(function ()
{
  $('#registerFrontUpload').on('change', function ()
  {
    previewFrontImg(input);
  });
  $('#registerBackUpload').on('change', function ()
  {
    previewBackImg(input);
  });

});

// Forgot password

//OTP 
$('.digit-group').find('input').each(function ()
{
  $(this).attr('maxlength', 1);
  $(this).on('keyup', function (e)
  {
    var parent = $($(this).parent());

    if (e.keyCode === 8 || e.keyCode === 37)
    {
      var prev = parent.find('input#' + $(this).data('previous'));

      if (prev.length)
      {
        $(prev).select();
      }
    } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39)
    {
      var next = parent.find('input#' + $(this).data('next'));

      if (next.length)
      {
        $(next).select();
      } else
      {
        if (parent.data('autosubmit'))
        {
          parent.submit();
        }
      }
    }
  });
});


// Toggle sidebar in admin page

$('.sidebar-toggle').on('click', function ()
{
  $('.sidebar').toggleClass('active');
  $('.admin--content').toggleClass('active');
});


// tooltip bootstrap
$(document).ready(function ()
{
  $('[data-toggle="tooltip"]').tooltip();
});


// Show view identify card photos modal in User Detail

$('.user-detail-idcard').click(function ()
{
  $('#viewIDCPhotoModal').modal('show');
})

$('.profile-idcard').click(function ()
{
  $('#viewIDCPhotoUserModal').modal('show');
})

$('.btn-modal-submit').click(function ()
{
  $('#updateIDCPhotoModal').modal('hide');
})

$('.btn-modal-change-password').click(function ()
{
  $('#changePasswordModal').modal('hide');
})

$('.btn-modal-edit-info').click(function ()
{
  $('#editInformationModal').modal('hide');
})

//Validate recharge withdraw
function rechargeValidate()
{
  let cardnumber = $('input[name=recharge-cardnumber]').val();
  let expirydate = $('input[name=recharge-expirydate]').val();
  let cvv = $('input[name=recharge-cvvnumber]').val();
  let amount = $('input[name=recharge-amount]').val();

  if (!amount)
  {
    $('.recharge-amount-input').addClass('invalid-input');
    $('.recharge-amount-message').show();
    return false;
  } else
  {
    $('.recharge-amount-input').removeClass('invalid-input');
    $('.recharge-amount-message').hide();
  }

  if (cardnumber != '111111' && cardnumber != '222222' && cardnumber != '333333')
  {
    $('.recharge-cardnumber-input').addClass('invalid-input');
    $('.recharge-cardnumber-message').show();
    return false;
  } else if (cardnumber == '111111')
  {
    $('.recharge-cardnumber-input').removeClass('invalid-input');
    $('.recharge-cardnumber-message').hide();

    if (expirydate != '2022-10-10')
    {
      $('.recharge-date-input').addClass('invalid-input');
      $('.recharge-date-message').show();
      return false;
    }
    if (cvv != '411')
    {
      $('.recharge-date-input').removeClass('invalid-input');
      $('.recharge-date-message').hide();

      $('.recharge-cvv-input').addClass('invalid-input');
      $('.recharge-cvv-message').show();
      return false;
    }

  } else if (cardnumber == '222222')
  {
    $('.recharge-cardnumber-input').removeClass('invalid-input');
    $('.recharge-cardnumber-message').hide();

    if (expirydate != '2022-11-11')
    {
      $('.recharge-date-input').addClass('invalid-input');
      $('.recharge-date-message').show();
      return false;
    }
    if (cvv != '443')
    {
      $('.recharge-date-input').removeClass('invalid-input');
      $('.recharge-date-message').hide();

      $('.recharge-cvv-input').addClass('invalid-input');
      $('.recharge-cvv-message').show();
      return false;
    }

  } else if (cardnumber == '333333')
  {
    $('.recharge-cardnumber-input').removeClass('invalid-input');
    $('.recharge-cardnumber-message').hide();

    if (expirydate != '2022-12-12')
    {
      $('.recharge-date-input').addClass('invalid-input');
      $('.recharge-date-message').show();
      return false;
    }
    if (cvv != '577')
    {
      $('.recharge-date-input').removeClass('invalid-input');
      $('.recharge-date-message').hide();

      $('.recharge-cvv-input').addClass('invalid-input');
      $('.recharge-cvv-message').show();
      return false;
    }

  } else
  {
    return true;
  }
}

function withdrawValidate()
{
  let cardnumber = $('input[name=withdraw-cardnumber]').val();
  let expirydate = $('input[name=withdraw-expirydate]').val();
  let cvv = $('input[name=withdraw-cvvnumber]').val();
  let amount = $('input[name=withdraw-amount]').val();

  if (!amount)
  {
    $('.withdraw-amount-input').addClass('invalid-input');
    $('.withdraw-amount-message').show();
    return false;
  } else
  {
    $('.withdraw-amount-input').removeClass('invalid-input');
    $('.withdraw-amount-message').hide();
  }

  if (cardnumber != '111111')
  {
    $('#withdrawNotSupport').show();
    return false;
  } else
  {

    if (expirydate != '2022-10-10' || cvv != '411')
    {

      $('#withdrawInvalidCard').show();
      return false;
    } else
    {
      return true;
    }
  }

}

$('.btn-transac-info').click(function ()
{
  console.log("CLicked")
});

//Call api

//Call api send OTP
$("#btn-otp").click(function ()
{
  var email = $('input[name=email]').val()
  $.ajax({
    async: false,
    url: "http://localhost:3000/user/otp",
    type: "POST",
    data: JSON.stringify({ email }),
    dataType: 'json',
    processData: false,
    crossDomain: true,
    contentType: "application/json",
    success: function (response)
    {
      if (response.error.length > 0)
      {
        $('#alert-error').html(response.error)
        $('#alert-error').removeClass("fade")
      }
      if (response.success)
      {
        $('.account-email').html(response.email)
        $('#otpModal').modal('show')
      }
    },
  })
})

//Call api submit otp
$("#btn-submit-otp").click(function ()
{
  var digitMono = $('input[name=digitMono]').val()
  var digitDi = $('input[name=digitDi]').val()
  var digitTri = $('input[name=digitTri]').val()
  var digitTetra = $('input[name=digitTetra]').val()
  var digitPenta = $('input[name=digitPenta]').val()
  var digitHexa = $('input[name=digitHexa]').val()

  const code = digitMono + digitDi + digitTri + digitTetra + digitPenta + digitHexa
  $.ajax({
    async: false,
    url: "http://localhost:3000/user/verify",
    type: "POST",
    data: JSON.stringify({ code }),
    dataType: 'json',
    processData: false,
    crossDomain: true,
    contentType: "application/json",
    success: function (response)
    {

      if (response.error.length > 0)
      {
        $('#otpModal').modal('hide')
        $('#alert-error').html(error)
      }
      if (response.success)
      {
        $('#otpModal').modal('hide')
        $('.forgot-pwd--form-otp').hide();
        $('.forgot-pwd--form-pwd').show();
      }
    },
  })
})


//Call api to change password in forgot password
$(".btn-re-pass").click(function ()
{

  const pass = $('input[name=newpwd]').val()

  $.ajax({
    async: false,
    url: "http://localhost:3000/user/repass",
    type: "POST",
    data: JSON.stringify({ pass }),
    dataType: 'json',
    processData: false,
    crossDomain: true,
    contentType: "application/json",
    success: function (response)
    {

      if (response.error.length > 0)
      {
        $('.forgot-pwd--form-otp').hide();
        $('#alert-error').html(error)
      }
      if (response.success)
      {
        $('.forgot-pwd--form-pwd').hide()
        $('.alert-success').removeClass("fade")
      }
    },
  })
})

//Change password in user profile
$(".btn-modal-change-password").click(function ()
{

  const currentPass = $('input[name=currentpwd]').val()
  const newPass = $('input[name=newpwd]').val()
  $.ajax({
    async: false,
    url: "http://localhost:3000/user/changepass",
    type: "POST",
    data: JSON.stringify({ current: currentPass, pass: newPass }),
    dataType: 'json',
    processData: false,
    crossDomain: true,
    contentType: "application/json",
    success: function (response)
    {

      if (response.error.length > 0)
      {
        $('#alert-error').html(error)
        $('#alert-error').removeClass("fade")
      }
      if (response.success)
      {
        $('#alert-successful').append("Change password successfully");
        $('.alert-success').removeClass("fade")
      }
    },
  })
})

//Function call api
function getAccountList()
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/admin/accounts",
    type: "GET",
    contentType: "application/json",
    success: function (response)
    {
      console.log(response)
      let htmlContent = ""
      var classStt = ""
      for (var i = 0; i < response.length; i++)
      {
        //Substring createdAt to get only yyyy-mm-dd
        var created = response[i].created.substring(0, 10)
        //Substring updatedAt to get only yyyy-mm-dd
        var updated = response[i].updated.substring(0, 10)

        //Add class to status
        if (response[i].status == "Pending" || response[i].status == "Updating")
        {
          classStt = 'badge-warning'
        }
        if (response[i].status == "Activated")
        {
          classStt = 'badge-success'
        }
        if (response[i].status == "Deactivated")
        {
          classStt = 'badge-secondary'
        }
        if (response[i].status == "Locked")
        {
          classStt = 'badge-danger'
        }
        htmlContent = `
        <tr>
        <th scope="row">${i + 1}</th>
        <td>${response[i].username}</td>
        <td>${response[i].email}</td>
        <td>${created}</td>
        <td>${updated}</td>
        <td><span class="badge ${classStt}">${response[i].status}</span></td>
        <td>
            <!-- pass user id into this href -->
            <a href="/admin/account/user/${response[i].id}"><button class="btn btn-outline-primary"><i
                        class="fa-solid fa-search"></i></button></a>
            <!-- delete button  -->
            <!-- <button class="btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button> -->
        </td>
    </tr>
        `
        $('#admin-user-tbody').append(htmlContent)
      }
    },
  })
}

function getAccountListByStatus(stt)
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/admin/accounts/" + stt,
    type: "GET",
    contentType: "application/json",
    success: function (response)
    {
      var classStt = ""
      let htmlContent = ""
      for (var i = 0; i < response.length; i++)
      {
        //Substring createdAt to get only yyyy-mm-dd
        var created = response[i].created.substring(0, 10)

        //Substring updatedAt to get only yyyy-mm-dd
        var updated = response[i].updated.substring(0, 10)

        //Add class to status
        if (response[i].status == "Pending")
        {
          classStt = 'badge-warning'
        }
        if (response[i].status == "Activated")
        {
          classStt = 'badge-success'
        }
        if (response[i].status == "Deactivated")
        {
          classStt = 'badge-secondary'
        }
        if (response[i].status == "Locked")
        {
          classStt = 'badge-danger'
        }
        htmlContent = `
        <tr>
        <th scope="row">${i + 1}</th>
        <td>${response[i].username}</td>
        <td>${response[i].email}</td>
        <td>${created}</td>
        <td>${updated}</td>
        <td><span class="badge ${classStt}">${response[i].status}</span></td>
        <td>
            <!-- pass user id into this href -->
            <a href="/admin/account/user/${response[i].id}"><button class="btn btn-outline-primary"><i
                        class="fa-solid fa-search"></i></button></a>
            <!-- delete button  -->
            <!-- <button class="btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button> -->
        </td>
    </tr>
        `
        $('#admin-user-tbody').append(htmlContent)
      }
    },
  })
}

function updateAccountStatus(email, status)
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/admin/account/" + email + "/" + status,
    type: "GET",
    contentType: "application/json",
    success: function (response)
    {
      console.log(response)
      var classStt = ""

      if (response.status == "Pending" || response.status == "Updating")
      {
        classStt = 'badge-warning'
      }
      if (response.status == "Activated")
      {
        classStt = 'badge-success'
      }
      if (response.status == "Deactivated")
      {
        classStt = 'badge-secondary'
      }
      if (response.status == "Locked")
      {
        classStt = 'badge-danger'
      }

      $('.status-div').find('span').remove()
      var contentHTML = `
      <span class="badge ${classStt}">${response.status}</span>
      `
      $('.status-div').append(contentHTML)
      $('#activateModal').modal('hide')
    },
  })
}

//Transaction api
function sendTransaction(type, amount, card, expiry, cvv, note)
{
  $.ajax({
    async: true,
    url: "http://localhost:3000/trans/api/" + type,
    type: "POST",
    data: JSON.stringify({ amount: amount, card: card, expiry: expiry, cvv: cvv, note: note }),
    dataType: 'json',
    processData: false,
    crossDomain: true,
    contentType: "application/json",
    success: function (response)
    {
      console.log(response)
      if (response.error.length > 0)
      {
        $('.success-trans').text(response.error)
        $('#modalSuccessTrans').modal('show')
      }
      if (response.success)
      {
        $('#modalSuccessTrans').modal('show')
      }
    }
  })
}

$('.btn-modal-edit-info').click(function ()
{
  $('#editInformationModal').modal('hide');
})

$('.transfer-otp-toggle').click(function ()
{
  $('#otpTransferModal').modal('show');
})

$('.service--amount-input').keyup(function ()
{
  let amount = Number($('input[name=withdraw-amount]').val())
  let fee = (amount / 100) * 5
  $('.withdraw-fee').html(fee + '<i class="fa-solid fa-dong-sign"></i>')
  let total = amount + fee
  $('.withdraw-total-fee').html(total + '<i class="fa-solid fa-dong-sign"></i>')
});

$('input[name=transfer-amount]').keyup(function ()
{
  automaticCount()
});

$('#bearer-select').on('change', function (e)
{
  console.log("Changed")
  console.log($("#bearer-select option:selected").val())
  automaticCount()
});

function automaticCount()
{
  let amount = Number($('input[name=transfer-amount]').val())
  let fee = (amount / 100) * 5
  $('.transfer-fee').html(fee + '<i class="fa-solid fa-dong-sign"></i>')
  let total = 0
  if ($("#bearer-select option:selected").val() == "Sender")
  {
    total = amount + fee
  }
  else
  {
    total = amount
  }
  $('.transfer-total').html(total + '<i class="fa-solid fa-dong-sign"></i>')
}

$('.key-up-receiver').keyup(function ()
{
  var phone = $('input[name=receiver]').val()
  console.log(phone.length)
  if (phone.length == 10)
  {
    return getUserNameForReceiver(phone)
  }
});

function getUserNameForReceiver(phone)
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/user/info/" + phone,
    type: "GET",
    contentType: "application/json",
    success: function (response)
    {
      console.log(response)
      $('#receiver-name').attr('placeholder',
        response.name);
    }
  })
}

function transferMoney(receiver, feeler, money, note)
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/trans/api/transfer",
    type: "POST",
    data: JSON.stringify({ receiver: receiver, feeler: feeler, amount: money, note: note }),
    dataType: 'json',
    processData: false,
    crossDomain: true,
    contentType: "application/json",
    success: function (response)
    {
      console.log(response)
      if (response.error.length > 0)
      {
        $('.success-trans').text(response.error)
        $('#modalSuccessTrans').modal('show')
      }
      if (response.success)
      {
        $('#modalSuccessTrans').modal('show')
      }
    }
  })
}

function getOTP(email)
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/user/otp",
    type: "POST",
    data: JSON.stringify({ email }),
    dataType: 'json',
    processData: false,
    crossDomain: true,
    contentType: "application/json",
    success: function (response)
    {
      console.log(response)
    },
  })
}

function getTransactionList()
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/admin/transactions",
    type: "GET",
    contentType: "application/json",
    success: function (response)
    {
      var classStt = ""
      var iTag = ""
      let htmlContent = ""
      for (var i = 0; i < response.length; i++)
      {
        //Substring createdAt to get only yyyy-mm-dd
        var created = response[i].time.substring(0, 10)
        console.log(response[i].type)
        //Add class to status
        if (response[i].type == "Recharge")
        {
          iTag = "fa-solid fa-circle-arrow-up"
        }
        if (response[i].type == "Withdraw")
        {
          iTag = "fa-solid fa-circle-arrow-down"
        }
        if (response[i].type == "Pending")
        {
          iTag = "fa-solid fa-repeat"
        }
        if (response[i].status == "Pending")
        {
          classStt = 'badge-warning'
        }
        if (response[i].status == "Success")
        {
          classStt = 'badge-success'
        }
        htmlContent = `
        <tr>
        <th scope="row"><i class="${iTag}"></i></th>
        <td>${response[i].username}</td>
        <td>${response[i].type}</td>
        <!-- use javascript to format the total instead of below  -->
        <td>${response[i].amount}<i class="fa-solid fa-dong-sign"></i></td>
        <td>${response[i].time}</td>
        <td><span class="badge ${classStt}">${response[i].status}</span></td>
        <td>
            <button type="button" onclick="transactionDetail(${response[i].id})" class="btn btn-outline-primary btn-transac-info" data-toggle="modal"
                data-target="#viewTransferAdminModal"><i class="fa-solid fa-search"></i></button>
        </td>

      </tr>
        `
        $('#admin-transaction-tbody').append(htmlContent)
      }
    },
  })
}

function getTransactionsByStatus(stt)
{
  $.ajax({
    async: false,
    url: "http://localhost:3000/admin/transactions/" + stt,
    type: "GET",
    contentType: "application/json",
    success: function (response)
    {
      var classStt = ""
      var iTag = ""
      let htmlContent = ""
      for (var i = 0; i < response.length; i++)
      {
        //Substring createdAt to get only yyyy-mm-dd
        var created = response[i].time.substring(0, 10)

        //Add class to status
        if (response[i].type == "Recharge")
        {
          iTag = "fa-solid fa-circle-arrow-up"
        }
        if (response[i].type == "Withdraw")
        {
          iTag = "fa-solid fa-circle-arrow-down"
        }
        if (response[i].type == "Pending")
        {
          iTag = "fa-solid fa-repeat"
        }
        if (response[i].status == "Pending")
        {
          classStt = 'badge-warning'
        }
        if (response[i].status == "Success")
        {
          classStt = 'badge-success'
        }
        htmlContent = `
        <tr>
        <th scope="row"><i class="${iTag}"></i></th>
        <td>${response[i].username}</td>
        <td>${response[i].type}</td>
        <!-- use javascript to format the total instead of below  -->
        <td>${response[i].amount}<i class="fa-solid fa-dong-sign"></i></td>
        <td>${response[i].time}</td>
        <td><span class="badge ${classStt}">${response[i].status}</span></td>
        <td>
            <button type="button" onclick="transactionDetail(${response[i].id})" class="btn btn-outline-primary btn-transac-info" data-toggle="modal"
                data-target="#viewTransferAdminModal"><i class="fa-solid fa-search"></i></button>
        </td>

      </tr>
        `
        $('#admin-transaction-tbody').append(htmlContent)
      }
    },
  })
}

function updatePrice(){
  var selectedprice = $('.card-price').val();
  var quantity = $(".card-quantity").val();
  var total = Number(quantity)* Number(selectedprice)
  $('.card-total').html(total + '<i class="fa-solid fa-dong-sign"></i>')
}

function transactionDetail(id){
  $.ajax({
    async: false,
    url: "http://localhost:3000/admin/transaction/" + id,
    type: "GET",
    contentType: "application/json",
    success: function (response)
    {
      var classStt = ""
      var iTag = ""
      let htmlContent = ""
        htmlContent = 
      console.log(response)
    },
  })
}
