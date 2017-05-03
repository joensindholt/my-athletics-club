Write-Output "Building frontend"
Set-Location .\frontend
.\build.ps1

Write-Output "Building frontend 2"
Set-Location ..\frontend2
.\build.ps1

Write-Output "Building api"
Set-Location ..\api
.\build.ps1
