var defaultOptions =
{
    pbr: true,
    sb: true
}

function saveOptions(e)
{
    e.preventDefault()
    browser.storage.local.set(
    {
        pbr: document.querySelector('#pbr').checked,
        sb: document.querySelector('#sb').checked
    })
  }

function restoreOptions()
{
    function setCurrentChoice(result)
    {
        document.querySelector('#pbr').checked = result.pbr !== undefined  ? result.pbr : defaultOptions.pbr
        document.querySelector('#sb').checked = result.sb !== undefined  ? result.sb : defaultOptions.sb
    }

    function onError(error)
    {
        console.log(`Error: ${error}`)
    }

    let getting = browser.storage.local.get()
    getting.then(setCurrentChoice, onError)
}

document.addEventListener('DOMContentLoaded', restoreOptions)
let options = document.querySelectorAll('.option')

options.forEach(function(i)
{
    i.addEventListener('change', saveOptions)
})
  