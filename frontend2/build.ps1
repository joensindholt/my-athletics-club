if (Test-Path node_modules) {
    Write-Output "Removing node_modules directory"
    Remove-Item -Recurse -Force node_modules
}

if (Test-Path dist) {
    Write-Output "Removing dist directory"
    Remove-Item -Recurse -Force dist
}

npm install
npm run build
