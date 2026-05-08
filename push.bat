@echo off
chcp 65001 >nul
echo =======================================
echo     GITHUB AUTO PUSH SCRIPT
echo =======================================
echo.

set "commit_msg="
set /p commit_msg="Nhap noi dung commit (De trong se tu dong lay mac dinh): "
if not defined commit_msg set "commit_msg=Auto update from Q Token Ecosystem MVP"

echo.
echo [1/3] Dang them file vao Git...
git add .

echo.
echo [2/3] Dang commit du lieu...
git commit -m "%commit_msg%"

echo.
echo [3/3] Dang day len Github...
git push

echo.
echo =======================================
echo     HOAN TAT!
echo =======================================
pause
