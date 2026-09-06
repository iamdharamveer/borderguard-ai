@echo off
title SentinelBorder - Local Offline Server
echo =====================================================================
echo    SENTINELBORDER - LOCAL OFFLINE LOOPBACK SERVER (NO INTERNET)
echo =====================================================================
echo Running strictly on your local PC (127.0.0.1) without any internet.
echo Opening http://localhost:8080 (Required if you want to use the live webcam)...
echo.
echo NOTE: You can also simply double-click 'open_offline.bat' or 'index.html'
echo to run completely without any server!
echo =====================================================================
start http://localhost:8080
python -m http.server 8080
pause
