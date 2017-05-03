if (Test-Path node_modules) {
    Write-Output "Removing node_modules directory"
    Remove-Item -Recurse -Force node_modules
}

if (Test-Path bower_components) {
    Write-Output "Removing bower_components directory"
    Remove-Item -Recurse -Force bower_components
}

if (Test-Path typings) {
    Write-Output "Removing typings directory"
    Remove-Item -Recurse -Force typings
}

if (Test-Path dist) {
    Write-Output "Removing dist directory"
    Remove-Item -Recurse -Force dist
}

npm run build
gulp