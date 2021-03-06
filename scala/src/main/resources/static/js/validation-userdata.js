var password = $('#password').changes()
var passwordValidation = mkValidation(password, requiredValidator())
passwordValidation.subscribe(toggleEffect($('.password-error')))
passwordValidation.subscribe(toggleClassEffect($('#password'), 'invalid'))

var password2 = $('#password-copy').changes()

var pwdValidation = mkValidation(combine([password, password2]), emptyOk(matchingValuesValidator()))
pwdValidation.subscribe(toggleEffect($('.password-match-error')))
pwdValidation.subscribe(toggleClassEffect($('#password'), 'invalid'))
pwdValidation.subscribe(toggleClassEffect($('#password2'), 'invalid'))

var weight = $('#weight').changes()
var weightValidation = mkValidation(weight, numberValidator())
weightValidation.subscribe(toggleEffect($('.weight-error')))
weightValidation.subscribe(toggleClassEffect($('#weight'), 'invalid'))

var all = combine([passwordValidation, pwdValidation, weightValidation])
all.subscribe(disableEffect($('#submit')))
