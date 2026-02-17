$ErrorActionPreference = "Stop"

# Enable TLS 1.2 for download
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$mavenVersion = "3.9.6"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenDir = "$PSScriptRoot\maven"
$mavenBin = "$mavenDir\apache-maven-$mavenVersion\bin\mvn.cmd"
$javaDir = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"

# Set JAVA_HOME
$env:JAVA_HOME = $javaDir
$env:Path = "$javaDir\bin;$env:Path"

# Check if Maven is present
if (-not (Test-Path $mavenBin)) {
    Write-Host "Maven not found. Downloading..."
    if (-not (Test-Path $mavenDir)) {
        New-Item -ItemType Directory -Force -Path $mavenDir | Out-Null
    }
    $zipPath = "$mavenDir\maven.zip"
    Invoke-WebRequest -Uri $mavenUrl -OutFile $zipPath
    
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $zipPath -DestinationPath $mavenDir -Force
    Remove-Item $zipPath
    Write-Host "Maven installed."
}

# Run Spring Boot
Write-Host "Building Spring Boot Application..."
& $mavenBin -f "$PSScriptRoot\backend\pom.xml" clean install | Out-File -Encoding ascii "$PSScriptRoot\backend_build.txt"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build success. Starting..."
    & $mavenBin -f "$PSScriptRoot\backend\pom.xml" spring-boot:run | Out-File -Encoding ascii "$PSScriptRoot\backend_run.txt"
}
else {
    Write-Host "Build failed. Check backend_build.txt"
    exit 1
}
