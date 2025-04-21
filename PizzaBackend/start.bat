@echo off

:: Indítjuk a Backend-et (ASP.NET Core)
echo Checking NuGet sources...
dotnet nuget list source | find "nuget.org" > nul
if %errorlevel% equ 0 (
    echo nuget.org source is already added.
) else (
    echo Adding nuget.org source...
    dotnet nuget add source "https://api.nuget.org/v3/index.json" -n "nuget.org"
)

:: Indítjuk a Backend-et (ASP.NET Core)

echo Starting Backend...
cmd /k "dotnet restore && dotnet build && dotnet clean && dotnet run"

:: Indítjuk a Frontend-et (React + Vite) ha szükséges
::cd "C:\path\to\frontend\project"
::echo Starting Frontend...
::cmd /k "npm run dev"

echo Backend is now running.
pause