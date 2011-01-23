var email = $('#email').changes()
var emailValidation = mkValidation(email, emailValidator())
emailValidation.Subscribe(toggleEffect($('.email-error')))
emailValidation.Subscribe(toggleClassEffect($('#email'), 'invalid'))

var password = $('#password').changes()
var passwordValidation = mkValidation(password, requiredValidator())
passwordValidation.Subscribe(toggleEffect($('.password-error')))
passwordValidation.Subscribe(toggleClassEffect($('#password'), 'invalid'))

var password2 = $('#password-copy').changes()

var pwdValidation = mkValidation(combine([password, password2]), emptyOk(matchingValuesValidator()))
pwdValidation.Subscribe(toggleEffect($('.password-match-error')))
pwdValidation.Subscribe(toggleClassEffect($('#password'), 'invalid'))
pwdValidation.Subscribe(toggleClassEffect($('#password2'), 'invalid'))

var all = combine([emailValidation, passwordValidation, pwdValidation])
all.Subscribe(disableEffect($('#submit')))
