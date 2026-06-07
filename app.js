console.log('[VV][APP_JS_VERSION] feed-button-fix-001 loaded');
var phoneThemes = {
  default: {
    name: '默认主题',
    wallpaper:'https://s41.ax1x.com/2026/04/13/peBWtbV.jpg',
    html: `
        <div id="homePage" class="page">
          <div class="phone-notch">
            <div class="notch-sensor"></div>
            <div class="notch-forum"></div>
            <div class="notch-speaker"></div>
            <div class="notch-sensor"></div>
          </div>

          <div class="status-bar">
            <div class="status-bar-right">
              <svg class="status-icon-svg" viewBox="0 -1.5 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          
                  <title>wifi [#1029]</title>
                  <desc>Created with Sketch.</desc>
                  <defs>

              </defs>
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Dribbble-Light-Preview" transform="translate(-423.000000, -3604.000000)" fill="#000000">
                          <g id="icons" transform="translate(56.000000, 160.000000)">
                              <path d="M372.109921,3452.95655 L372.804851,3453.69409 C373.189176,3454.10197 373.811369,3454.10197 374.194711,3453.69409 L374.889641,3452.95655 C374.121974,3452.14182 372.877588,3452.14182 372.109921,3452.95655 M369.330202,3450.00642 L370.720061,3451.48148 C372.252446,3449.85411 374.747116,3449.85411 376.280483,3451.48148 L377.670343,3450.00642 C375.367344,3447.56118 371.633201,3447.56118 369.330202,3450.00642 M379.711884,3447.83867 L379.060203,3448.5303 C375.989537,3445.27139 371.011008,3445.27139 367.939359,3448.5303 L367.287678,3447.83867 C366.870917,3447.39636 366.913183,3446.66404 367.374176,3446.27285 C370.948101,3443.24238 376.052444,3443.24238 379.626369,3446.27285 C380.087362,3446.66404 380.128645,3447.39636 379.711884,3447.83867" id="wifi-[#1029]">

              </path>
                          </g>
                      </g>
                  </g>
              </svg>
              <svg class="status-icon-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16272" width="200" height="200"><path d="M144.700101 684.994006l535.580045 0L680.280146 359.237781 144.700101 359.237781 144.700101 684.994006 144.700101 684.994006zM918.373823 440.680675l0-81.442894c0-44.791136-36.649711-81.437777-81.437777-81.437777l-692.235944 0c-44.791136 0-81.437777 36.646642-81.437777 81.437777L63.262324 684.994006c0 44.791136 36.646642 81.442894 81.437777 81.442894l692.235944 0c44.788066 0 81.437777-36.650735 81.437777-81.442894l0-81.437777c22.396079 0 40.7194-18.322297 40.7194-40.7194l0-81.436754C959.093223 459.003995 940.769902 440.680675 918.373823 440.680675L918.373823 440.680675zM877.655446 481.400075l0 81.436754L877.655446 684.994006c0 22.395056-18.323321 40.718377-40.7194 40.718377l-692.235944 0c-22.396079 0-40.7194-18.323321-40.7194-40.718377L103.980701 359.237781c0-22.396079 18.323321-40.7194 40.7194-40.7194l692.235944 0c22.396079 0 40.7194 18.323321 40.7194 40.7194L877.655446 481.400075 877.655446 481.400075zM877.655446 481.400075" fill="#2c2c2c" p-id="16273"></path></svg>
            </div>
          </div>

          <div class="widget-container">
            <div class="widget">
              <div class="time" id="mainTime">12:00</div>
              <div class="date" id="mainDate">4月15日 周一</div>
              <div class="weather" id="mainWeather">晴朗 25°C</div>
            </div>
          </div>

          <div class="app-grid">
            <div class="app-block" onclick="playClickSound(); triggerSlash('/send 查看论坛|/trigger')">
              <img id="icon-forum" src="https://origin.picgo.net/2026/04/15/screenshot_20260415_230401ac0e003ae5dbdd48.jpg" alt="论坛">
              <span>论坛</span>
            </div>
            <div class="app-block" onclick="playClickSound();currentDiaryAction='write';openDiaryChoiceDialog();">
              <img id="icon-diary" src="https://origin.picgo.net/2026/04/13/screenshot_20260413_214158c86ca004be758e29.jpg" alt="日记">
              <span>日记</span>
            </div>
            <div class="app-block" onclick="playClickSound(); triggerSlash('/send 逛商城|/trigger')">
              <img id="icon-vvshop" src="https://origin.picgo.net/2026/04/13/screenshot_20260413_214210c427fd5878af47f3.jpg" alt="VV商城">
              <span>VV商城</span>
            </div>
            <div class="app-block" onclick="playClickSound(); triggerSlash('/send 看直播|/trigger')">
              <img id="icon-vvplatform" src="https://origin.picgo.net/2026/04/13/screenshot_20260413_214221696afed7b7486be8.jpg" alt="VV热播">
              <span>VV热播</span>
            </div>
          </div>

          <div class="bottom-bar">
            <div class="app" onclick="playClickSound(); showDialog('addCallDialog')">
              <img id="icon-contact" src="https://origin.picgo.net/2026/04/13/screenshot_20260413_214204016ae99443901678.jpg" alt="电话">
              <span>电话</span>
            </div>
            <div class="app" onclick="playClickSound(); openContactPage()">
              <img id="icon-text" src="https://origin.picgo.net/2026/04/13/screenshot_20260413_2142073e7ab738f74ed308.jpg" alt="消息">
              <span>消息</span>
            </div>
            <div class="app" onclick="playClickSound(); triggerSlash('/send 播放音乐|/trigger')">
              <img id="icon-music" src="https://origin.picgo.net/2026/04/15/screenshot_20260415_2301265271c70deb5e9cc0.jpg" alt="音乐">
              <span>音乐</span>
            </div>
            <div class="app" onclick="playClickSound(); showDialog('settingDialog')">
              <img id="icon-setting" src="https://origin.picgo.net/2026/04/15/screenshot_20260415_230347988f62db5134cb2a.jpg" alt="设置">
              <span>设置</span>
            </div>
          </div>
        </div>
    `,
    css: ``
  },
  theme1: {
    name: '主题一',
    wallpaper:'https://origin.picgo.net/2026/05/24/screenshot_20260524_025956a38280e38b924ef2.jpg',
    html: `
      <div id="homePage" class="page">
        <div class="phone-notch">
          <div class="notch-sensor"></div>
          <div class="notch-forum"></div>
          <div class="notch-speaker"></div>
          <div class="notch-sensor"></div>
        </div>

        <div class="status-bar">
          <div class="status-bar-right">
            <svg class="status-icon-svg" viewBox="0 -1.5 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        
                <title>wifi [#1029]</title>
                <desc>Created with Sketch.</desc>
                <defs>

            </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-423.000000, -3604.000000)" fill="#000000">
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                            <path d="M372.109921,3452.95655 L372.804851,3453.69409 C373.189176,3454.10197 373.811369,3454.10197 374.194711,3453.69409 L374.889641,3452.95655 C374.121974,3452.14182 372.877588,3452.14182 372.109921,3452.95655 M369.330202,3450.00642 L370.720061,3451.48148 C372.252446,3449.85411 374.747116,3449.85411 376.280483,3451.48148 L377.670343,3450.00642 C375.367344,3447.56118 371.633201,3447.56118 369.330202,3450.00642 M379.711884,3447.83867 L379.060203,3448.5303 C375.989537,3445.27139 371.011008,3445.27139 367.939359,3448.5303 L367.287678,3447.83867 C366.870917,3447.39636 366.913183,3446.66404 367.374176,3446.27285 C370.948101,3443.24238 376.052444,3443.24238 379.626369,3446.27285 C380.087362,3446.66404 380.128645,3447.39636 379.711884,3447.83867" id="wifi-[#1029]">

            </path>
                        </g>
                    </g>
                </g>
            </svg>
            <svg class="status-icon-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16272" width="200" height="200"><path d="M144.700101 684.994006l535.580045 0L680.280146 359.237781 144.700101 359.237781 144.700101 684.994006 144.700101 684.994006zM918.373823 440.680675l0-81.442894c0-44.791136-36.649711-81.437777-81.437777-81.437777l-692.235944 0c-44.791136 0-81.437777 36.646642-81.437777 81.437777L63.262324 684.994006c0 44.791136 36.646642 81.442894 81.437777 81.442894l692.235944 0c44.788066 0 81.437777-36.650735 81.437777-81.442894l0-81.437777c22.396079 0 40.7194-18.322297 40.7194-40.7194l0-81.436754C959.093223 459.003995 940.769902 440.680675 918.373823 440.680675L918.373823 440.680675zM877.655446 481.400075l0 81.436754L877.655446 684.994006c0 22.395056-18.323321 40.718377-40.7194 40.718377l-692.235944 0c-22.396079 0-40.7194-18.323321-40.7194-40.718377L103.980701 359.237781c0-22.396079 18.323321-40.7194 40.7194-40.7194l692.235944 0c22.396079 0 40.7194 18.323321 40.7194 40.7194L877.655446 481.400075 877.655446 481.400075zM877.655446 481.400075" fill="#2c2c2c" p-id="16273"></path></svg>
          </div>
        </div>

        <div class="widget-container">
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzE3IiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMzE3IDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Zm9yZWlnbk9iamVjdCB4PSItNCIgeT0iLTQiIHdpZHRoPSIzMjUiIGhlaWdodD0iNjgiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJiYWNrZHJvcC1maWx0ZXI6Ymx1cigycHgpO2NsaXAtcGF0aDp1cmwoI2JnYmx1cl8wXzM1N18yMzZfY2xpcF9wYXRoKTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlIj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PGcgaWQ9IlJlY3RhbmdsZSAxIiBkYXRhLWZpZ21hLWJnLWJsdXItcmFkaXVzPSI0Ij4KPHBhdGggZD0iTTMxNi41IDI3LjVDMzE2LjUgMTIuNTg4MyAzMDQuNDEyIDAuNSAyODkuNSAwLjVIMjcuNUMxMi41ODgzIDAuNSAwLjUgMTIuNTg4MyAwLjUgMjcuNVYzMi41QzAuNSA0Ny40MTE3IDEyLjU4ODMgNTkuNSAyNy41IDU5LjVIMjg5LjVDMzA0LjQxMiA1OS41IDMxNi41IDQ3LjQxMTcgMzE2LjUgMzIuNVYyNy41WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzM1N18yMzYpIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6aGFyZC1saWdodCIvPgo8cGF0aCBkPSJNMzE2LjUgMjcuNUMzMTYuNSAxMi41ODgzIDMwNC40MTIgMC41IDI4OS41IDAuNUgyNy41QzEyLjU4ODMgMC41IDAuNSAxMi41ODgzIDAuNSAyNy41VjMyLjVDMC41IDQ3LjQxMTcgMTIuNTg4MyA1OS41IDI3LjUgNTkuNUgyODkuNUMzMDQuNDEyIDU5LjUgMzE2LjUgNDcuNDExNyAzMTYuNSAzMi41VjI3LjVaIiBzdHJva2U9IiMwRjBGMEYiIHN0cm9rZS1vcGFjaXR5PSIwLjU1IiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6aGFyZC1saWdodCIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImJnYmx1cl8wXzM1N18yMzZfY2xpcF9wYXRoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDQpIj48cGF0aCBkPSJNMzE2LjUgMjcuNUMzMTYuNSAxMi41ODgzIDMwNC40MTIgMC41IDI4OS41IDAuNUgyNy41QzEyLjU4ODMgMC41IDAuNSAxMi41ODgzIDAuNSAyNy41VjMyLjVDMC41IDQ3LjQxMTcgMTIuNTg4MyA1OS41IDI3LjUgNTkuNUgyODkuNUMzMDQuNDEyIDU5LjUgMzE2LjUgNDcuNDExNyAzMTYuNSAzMi41VjI3LjVaIi8+CjwvY2xpcFBhdGg+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzM1N18yMzYiIHgxPSIxNTguNSIgeTE9IjAuNSIgeDI9IjE1OC41IiB5Mj0iNTkuNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcC8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzQyNDI0MiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=">        
          <div class="time" style="position: absolute;left: 25px;top: 8px;width: 112px;text-align: left;vertical-align: top;display: flex;flex-direction: row;justify-content: flex-start;color:var(--text-color);font-size: 24px;" id="mainTime">12:00</div>
          <div class="date" style="position: absolute;left: 25px;top: 37px;width: 112px;text-align: left;vertical-align: top;display: flex;flex-direction: row;justify-content: flex-start;color:var(--text-color);font-size: 12px;" id="mainDate">5月22日 周五</div>
          <div class="weather" style="position: absolute;left: 176px;top: 18px;width: 120px;text-align: left;vertical-align: top;display: flex;flex-direction: row;justify-content: flex-start;color:var(--text-color);font-size: 24px;" id="mainWeather">晴朗 25°C</div>
        </div>

        <div class="app-1">
          <div class="app-block" onclick="playClickSound();currentDiaryAction='write';openDiaryChoiceDialog();">
            <img id="icon-diary" src="https://origin.picgo.net/2026/05/23/-182_202605220003_0152825964f03819ddf4a.jpg" alt="日记">
            <span>日记</span>
          </div>
          <div class="app-block" onclick="playClickSound(); triggerSlash('/send 查看论坛|/trigger')">
            <img id="icon-forum" src="https://origin.picgo.net/2026/05/23/-182_202605230608_1351277e363086bf6e5d9.jpg" alt="论坛">
            <span>论坛</span>
          </div>
        </div>
        <div class="app-2">
          <div class="app-block" onclick="playClickSound(); triggerSlash('/send 逛商城|/trigger')">
            <img id="icon-vvshop" src="https://origin.picgo.net/2026/05/23/-182_202605220003_150879f4f6e19e04fcb1d.jpg" alt="VV商城">
            <span>VV商城</span>
          </div>
          <div class="app-block" onclick="playClickSound(); triggerSlash('/send 看直播|/trigger')">
            <img id="icon-vvplatform" src="https://origin.picgo.net/2026/05/23/-182_202605230609_201976bd17625577cd137.jpg" alt="VV热播">
            <span>VV热播</span>
          </div>
        </div>
        <div class="app-3">
          <div class="app" onclick="playClickSound(); showDialog('addCallDialog')">
            <img id="icon-contact" src="https://origin.picgo.net/2026/05/23/-182_202605211810_174279b442dd1aaba3f4c.jpg" alt="电话">
            <span>电话</span>
          </div>
          <div class="app" onclick="playClickSound(); openContactPage()">
            <img id="icon-text" src="https://origin.picgo.net/2026/05/23/-182_202605230609_1039165e22fc87be1f916.jpg" alt="消息">
            <span>消息</span>
          </div>
          <div class="app" onclick="playClickSound(); showDialog('settingDialog')">
            <img id="icon-setting" src="https://origin.picgo.net/2026/05/23/-182_202605230608_34739dea03df9b0e6afd4.jpg" alt="设置">
            <span>设置</span>
          </div>
        </div>
        <div class="app-4">
          <div class="app" onclick="playClickSound(); triggerSlash('/send 播放音乐|/trigger')">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgxIiBoZWlnaHQ9IjE4MSIgdmlld0JveD0iMCAwIDE4MSAxODEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMSIgY3g9IjkwLjUiIGN5PSI5MC41IiByPSI5MC41IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K" width="140" height="140" style="width: 140px; left: 29px; top: 134px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc3IiBoZWlnaHQ9IjE3NyIgdmlld0JveD0iMCAwIDE3NyAxNzciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMiIgY3g9Ijg4LjUiIGN5PSI4OC41IiByPSI4OC41IiBmaWxsPSIjMjAyMDIwIi8+Cjwvc3ZnPgo=" width="138" height="138" style="width: 138px; left: 30px; top: 135px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc1IiBoZWlnaHQ9IjE3NSIgdmlld0JveD0iMCAwIDE3NSAxNzUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMyIgY3g9Ijg3LjUiIGN5PSI4Ny41IiByPSI4Ny41IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K" width="136" height="136" style="width: 136px; left: 31px; top: 136px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTczIiBoZWlnaHQ9IjE3MyIgdmlld0JveD0iMCAwIDE3MyAxNzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgNSIgY3g9Ijg2LjUiIGN5PSI4Ni41IiByPSI4Ni41IiBmaWxsPSIjMjAyMDIwIi8+Cjwvc3ZnPgo=" width="134" height="134" style="width: 134px; left: 32px; top: 137px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE3MSIgdmlld0JveD0iMCAwIDE3MSAxNzEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGlkPSJFbGxpcHNlIDkiIGQ9Ik0xNzEgODUuNUMxNzEgMTMyLjcyIDEzMi43MiAxNzEgODUuNSAxNzFDMzguMjc5NyAxNzEgMCAxMzIuNzIgMCA4NS41QzAgMzguMjc5NyAzOC4yNzk3IDAgODUuNSAwQzEzMi43MiAwIDE3MSAzOC4yNzk3IDE3MSA4NS41WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="132" height="132" style="width: 132px; left: 33px; top: 138px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTY5IiBoZWlnaHQ9IjE2OSIgdmlld0JveD0iMCAwIDE2OSAxNjkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgNyIgY3g9Ijg0LjUiIGN5PSI4NC41IiByPSI4NC41IiBmaWxsPSIjMjAyMDIwIi8+Cjwvc3ZnPgo=" width="130" height="130" style="width: 130px; left: 34px; top: 139px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTY3IiBoZWlnaHQ9IjE2NyIgdmlld0JveD0iMCAwIDE2NyAxNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgOCIgY3g9IjgzLjUiIGN5PSI4My41IiByPSI4My41IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K" width="128" height="128" style="width: 128px; left: 35px; top: 140px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTY1IiBoZWlnaHQ9IjE2NSIgdmlld0JveD0iMCAwIDE2NSAxNjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgNiIgY3g9IjgyLjUiIGN5PSI4Mi41IiByPSI4Mi41IiBmaWxsPSIjMjAyMDIwIi8+Cjwvc3ZnPgo=" width="126" height="126" style="width: 126px; left: 36px; top: 141px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYzIiBoZWlnaHQ9IjE2MyIgdmlld0JveD0iMCAwIDE2MyAxNjMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTYiIGN4PSI4MS41IiBjeT0iODEuNSIgcj0iODEuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="124" height="124" style="width: 124px; left: 37px; top: 142px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYxIiBoZWlnaHQ9IjE2MSIgdmlld0JveD0iMCAwIDE2MSAxNjEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTMiIGN4PSI4MC41IiBjeT0iODAuNSIgcj0iODAuNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="122" height="122" style="width: 122px; left: 38px; top: 143px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU5IiBoZWlnaHQ9IjE1OSIgdmlld0JveD0iMCAwIDE1OSAxNTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTQiIGN4PSI3OS41IiBjeT0iNzkuNSIgcj0iNzkuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="120" height="120" style="width: 120px; left: 39px; top: 144px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU3IiBoZWlnaHQ9IjE1NyIgdmlld0JveD0iMCAwIDE1NyAxNTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTIiIGN4PSI3OC41IiBjeT0iNzguNSIgcj0iNzguNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="118" height="118" style="width: 118px; left: 40px; top: 145px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU1IiBoZWlnaHQ9IjE1NSIgdmlld0JveD0iMCAwIDE1NSAxNTUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTUiIGN4PSI3Ny41IiBjeT0iNzcuNSIgcj0iNzcuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="116" height="116" style="width: 116px; left: 41px; top: 146px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUzIiBoZWlnaHQ9IjE1MyIgdmlld0JveD0iMCAwIDE1MyAxNTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTEiIGN4PSI3Ni41IiBjeT0iNzYuNSIgcj0iNzYuNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="114" height="114" style="width: 114px; left: 42px; top: 147px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUxIiBoZWlnaHQ9IjE1MSIgdmlld0JveD0iMCAwIDE1MSAxNTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTciIGN4PSI3NS41IiBjeT0iNzUuNSIgcj0iNzUuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="112" height="112" style="width: 112px; left: 43px; top: 148px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ5IiBoZWlnaHQ9IjE0OSIgdmlld0JveD0iMCAwIDE0OSAxNDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTgiIGN4PSI3NC41IiBjeT0iNzQuNSIgcj0iNzQuNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="110" height="110" style="width: 110px; left: 44px; top: 149px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ3IiBoZWlnaHQ9IjE0NyIgdmlld0JveD0iMCAwIDE0NyAxNDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMTkiIGN4PSI3My41IiBjeT0iNzMuNSIgcj0iNzMuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="108" height="108" style="width: 108px; left: 45px; top: 150px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ1IiBoZWlnaHQ9IjE0NSIgdmlld0JveD0iMCAwIDE0NSAxNDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjAiIGN4PSI3Mi41IiBjeT0iNzIuNSIgcj0iNzIuNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="106" height="106" style="width: 106px; left: 46px; top: 151px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQzIiBoZWlnaHQ9IjE0MyIgdmlld0JveD0iMCAwIDE0MyAxNDMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjEiIGN4PSI3MS41IiBjeT0iNzEuNSIgcj0iNzEuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="104" height="104" style="width: 104px; left: 47px; top: 152px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQxIiBoZWlnaHQ9IjE0MSIgdmlld0JveD0iMCAwIDE0MSAxNDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjIiIGN4PSI3MC41IiBjeT0iNzAuNSIgcj0iNzAuNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="102" height="102" style="width: 102px; left: 48px; top: 153px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM5IiBoZWlnaHQ9IjEzOSIgdmlld0JveD0iMCAwIDEzOSAxMzkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjMiIGN4PSI2OS41IiBjeT0iNjkuNSIgcj0iNjkuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="100" height="100" style="width: 100px; left: 49px; top: 154px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM3IiBoZWlnaHQ9IjEzNyIgdmlld0JveD0iMCAwIDEzNyAxMzciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjQiIGN4PSI2OC41IiBjeT0iNjguNSIgcj0iNjguNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="98" height="98" style="width: 98px; left: 50px; top: 155px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM1IiBoZWlnaHQ9IjEzNSIgdmlld0JveD0iMCAwIDEzNSAxMzUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjUiIGN4PSI2Ny41IiBjeT0iNjcuNSIgcj0iNjcuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="96" height="96" style="width: 96px; left: 51px; top: 156px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMzIiBoZWlnaHQ9IjEzMyIgdmlld0JveD0iMCAwIDEzMyAxMzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjYiIGN4PSI2Ni41IiBjeT0iNjYuNSIgcj0iNjYuNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="94" height="94" style="width: 94px; left: 52px; top: 157px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMxIiBoZWlnaHQ9IjEzMSIgdmlld0JveD0iMCAwIDEzMSAxMzEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjciIGN4PSI2NS41IiBjeT0iNjUuNSIgcj0iNjUuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="92" height="92" style="width: 92px; left: 53px; top: 158px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI5IiBoZWlnaHQ9IjEyOSIgdmlld0JveD0iMCAwIDEyOSAxMjkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMjgiIGN4PSI2NC41IiBjeT0iNjQuNSIgcj0iNjQuNSIgZmlsbD0iIzIwMjAyMCIvPgo8L3N2Zz4K" width="90" height="90" style="width: 90px; left: 54px; top: 159px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI3IiBoZWlnaHQ9IjEyNyIgdmlld0JveD0iMCAwIDEyNyAxMjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgaWQ9IkVsbGlwc2UgMzAiIGN4PSI2My41IiBjeT0iNjMuNSIgcj0iNjMuNSIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==" width="88" height="88" style="width: 88px; left: 55px; top: 160px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODciIHZpZXdCb3g9IjAgMCA4NSA4NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IlZlY3RvciA1IiBmaWx0ZXI9InVybCgjZmlsdGVyMF9mXzM1N18yNjYpIj4KPHBhdGggZD0iTTIgNTFMNjUuMzE0NyA4NC40ODU1TDgyLjg3MjEgNjkuODg4NEw2NSAyQzY1IDIgNDQuMzcxIDUuMTQyMTggMjYuNSAyMEM4LjYyOTAzIDM0Ljg1NzggMiA1MSAyIDUxWiIgZmlsbD0iYmxhY2siLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9mXzM1N18yNjYiIHg9IjAiIHk9IjAiIHdpZHRoPSI4NC44NzIxIiBoZWlnaHQ9Ijg2LjQ4NTUiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzM1N18yNjYiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==" width="84" height="86" style="width: 84.8721px;left: 30px;top: 130px;position: absolute;filter: blur(2px);" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODciIHZpZXdCb3g9IjAgMCA4NSA4NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IlZlY3RvciA2IiBmaWx0ZXI9InVybCgjZmlsdGVyMF9mXzM1N18yNjcpIj4KPHBhdGggZD0iTTgyLjk2MTUgMzYuMDA5MkwxOS41NDcxIDJMMiAxNi42MDk1TDE5LjQ2MTUgODQuNTA5MkMxOS40NjE1IDg0LjUwOTIgNDAuNTQ2OCA4MS4zMjg2IDU4LjQwNzMgNjYuNDU4MkM3Ni4yNjc4IDUxLjU4NzcgODIuOTYxNSAzNi4wMDkyIDgyLjk2MTUgMzYuMDA5MloiIGZpbGw9ImJsYWNrIi8+CjwvZz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl8zNTdfMjY3IiB4PSIwIiB5PSIwIiB3aWR0aD0iODQuOTYxNSIgaGVpZ2h0PSI4Ni41MDkyIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEiIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8zNTdfMjY3Ii8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=" width="84" height="86" style="width: 84.9615px;left: 82px;top: 188.5px;position: absolute;filter: blur(1px);" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODciIHZpZXdCb3g9IjAgMCA4NSA4NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IlZlY3RvciAzIiBmaWx0ZXI9InVybCgjZmlsdGVyMF9mXzM1N18yNjgpIj4KPHBhdGggZD0iTTIgNTFMNjUuMzE0NyA4NC40ODU1TDgyLjg3MjEgNjkuODg4NEw2NSAyQzY1IDIgNDQuMzcxIDUuMTQyMTggMjYuNSAyMEM4LjYyOTAzIDM0Ljg1NzggMiA1MSAyIDUxWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzM1N18yNjgpIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2ZfMzU3XzI2OCIgeD0iMCIgeT0iMCIgd2lkdGg9Ijg0Ljg3MjEiIGhlaWdodD0iODYuNDg1NSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfMzU3XzI2OCIvPgo8L2ZpbHRlcj4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzM1N18yNjgiIHgxPSIzNS4xODA2IiB5MT0iNzIuNDc1NiIgeDI9Ijc2Ljc3MSIgeTI9IjM3LjAzMjciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Q2RDVENSIvPgo8c3RvcCBvZmZzZXQ9IjAuNDkwMzg1IiBzdG9wLWNvbG9yPSIjQTFBMUExIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q2RDVENSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=" width="84" height="86" style=" width: 84.8721px;left: 26px;top: 127px;position: absolute;filter: blur(2px);" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODUiIGhlaWdodD0iODciIHZpZXdCb3g9IjAgMCA4NSA4NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IlZlY3RvciA0IiBmaWx0ZXI9InVybCgjZmlsdGVyMF9mXzM1N18yNjkpIj4KPHBhdGggZD0iTTgyLjk2MTUgMzYuMDA5MkwxOS41NDcxIDJMMiAxNi42MDk1TDE5LjQ2MTUgODQuNTA5MkMxOS40NjE1IDg0LjUwOTIgNDAuNTQ2OCA4MS4zMjg2IDU4LjQwNzMgNjYuNDU4MkM3Ni4yNjc4IDUxLjU4NzcgODIuOTYxNSAzNi4wMDkyIDgyLjk2MTUgMzYuMDA5MloiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8zNTdfMjY5KSIgZmlsbC1vcGFjaXR5PSIwLjYiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9mXzM1N18yNjkiIHg9IjAiIHk9IjAiIHdpZHRoPSI4NC45NjE1IiBoZWlnaHQ9Ijg2LjUwOTIiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzM1N18yNjkiLz4KPC9maWx0ZXI+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8zNTdfMjY5IiB4MT0iNDkuNjg5NyIgeTE9IjEzLjk4ODciIHgyPSI4LjEyNDI5IiB5Mj0iNDkuNDYwOSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRDZENUQ1Ii8+CjxzdG9wIG9mZnNldD0iMC40OTAzODUiIHN0b3AtY29sb3I9IiNBMUExQTEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRDZENUQ1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==" width="84" height="86" style="width: 84.9615px;left: 85px;top: 192px;position: absolute;filter: blur(2px);" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBpZD0iRWxsaXBzZSAxMCIgY3g9IjI1IiBjeT0iMjUiIHI9IjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZmlsbD0iI0Q2RDVENSIvPgo8L3N2Zz4K" width="50" height="50" style="width: 50px;left: 73px;top: 176px;position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBpZD0iRWxsaXBzZSAzNiIgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSIjRDREMkQyIi8+Cjwvc3ZnPgo=" width="24" height="24" style="width: 24px;left: 101px;top: 178px;position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBpZD0iRWxsaXBzZSAzNyIgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSIjRDREMkQyIi8+Cjwvc3ZnPgo=" width="24" height="24" style="width: 24px;left: 70px;top: 178px;position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBpZD0iRWxsaXBzZSA0IiBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNDgpIiBmaWxsPSIjRDNEMUQxIiBmaWxsLW9wYWNpdHk9IjAuNzkiLz4KPC9zdmc+Cg==" width="48" height="48" style="width: 48px;left: 74px;top: 177px;position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxMSAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggaWQ9IlZlY3RvciAxMiIgZD0iTTAuNjI3OTMgMC41NTE3NThDMS4wMzMyNyAwLjYwMzkwNCAxLjYxMDI3IDAuNzA4NTM0IDIuMjkxOTkgMC45MTYwMTZDMy42Njc2MyAxLjMzNDcxIDUuNDY1NzUgMi4xNzI3OCA3LjE0NjQ4IDMuODUzNTJDOC44MjcyMiA1LjUzNDI1IDkuNjY1MjkgNy4zMzIzNyAxMC4wODQgOC43MDgwMUMxMC4yOTM0IDkuMzk2MTEgMTAuMzk3NiA5Ljk3NzkgMTAuNDQ5MiAxMC4zODM4QzEwLjQ1MDIgMTAuMzkxNiAxMC40NTAyIDEwLjM5OTUgMTAuNDUxMiAxMC40MDcyQzkuMTgwMDkgMTAuMTgyMiA3LjgzMTQgOS43OTQ0NyA3LjE4NTU1IDkuNTM2MTNDNi4yNjA4NyA5LjE2NjI2IDQuNjQxMzYgOC45MzQzMyAzLjM1MzUyIDcuNjQ2NDhDMi4wNzUgNi4zNjc5NyAxLjk5NjgyIDUuNDA4NDIgMS40NzQ2MSAzLjg0MThDMS4yMzI1NyAzLjExNTY3IDAuOTg2NzM5IDIuMTM1MjMgMC43OTk4MDUgMS4zMjUyQzAuNzMzMzM2IDEuMDM3MTcgMC42NzU3MzIgMC43NzI0NzcgMC42Mjc5MyAwLjU1MTc1OFoiIGZpbGw9IiM5OTk5OTkiIHN0cm9rZT0iIzk5OTk5OSIvPgo8L3N2Zz4K" width="11" height="11" style="width: 11px;left: 114px;top: 178px;position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSI0IiB2aWV3Qm94PSIwIDAgMiA0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iVmVjdG9yIDEzIiBkPSJNMCAxQzAuNTkwMDcgMC44NDYwMzMgMC44MjQ5MzQgMC42NDYxNjcgMSAwQzEuMjE1NTMgMC42NDA5MTIgMS40MjkwMiAwLjg2ODM3MSAyIDFDMS4xNjA4NyAxLjQ4MDgzIDEuMDc1MTcgMi4xNzUzNCAxIDMuNUMwLjk5NzEzOCAyLjA0Mjk4IDAuODMzOTU2IDEuNDI2NjIgMCAxWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" width="2" height="3" style="width: 2px;left: 122px;top: 186px;position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIyIiB2aWV3Qm94PSIwIDAgMSAyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iVmVjdG9yIDE0IiBkPSJNMCAwLjU3MTQyOUMwLjI5NTAzNSAwLjQ4MzQ0NyAwLjQxMjQ2NyAwLjM2OTIzOCAwLjUgMEMwLjYwNzc2NCAwLjM2NjIzNSAwLjcxNDUxMiAwLjQ5NjIxMiAxIDAuNTcxNDI5QzAuNTgwNDM3IDAuODQ2MTkxIDAuNTM3NTg0IDEuMjQzMDUgMC41IDJDMC40OTg1NjkgMS4xNjc0MiAwLjQxNjk3OCAwLjgxNTIxMiAwIDAuNTcxNDI5WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" width="1" height="2" style="width: 1px;left: 121px;top: 184px;position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMTA1IiB2aWV3Qm94PSIwIDAgMjYgMTA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iVW5pb24iIGQ9Ik02IDY0LjVDNiA2NC41IDcgNzYgOSA4MC41QzExIDg1IDE2LjUgOTEuNSAxOCA5M0MxOS41IDk0LjUgMjYgMTAwLjUgMjYgMTAwLjVMMjIuNSAxMDQuNUMyMi41IDEwNC41IDE0LjUgOTggMTMgOTZDMTEuNSA5NCA2LjUgODkgNCA4My41QzEuNSA3OCAwIDY4IDAgNjQuNVYwSDZWNjQuNVoiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+Cg==" width="26" height="104" style="width: 16px; left: 24px; top: 129px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDggMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGlkPSJVbmlvbiIgZD0iTTQgMEM2LjIwOTE0IDAgOCAwLjIyMzg1OCA4IDAuNVYxMy41QzggMTMuNzc2MSA2LjIwOTE0IDE0IDQgMTRDMS43OTA4NiAxNCAwIDEzLjc3NjEgMCAxMy41VjAuNUMwIDAuMjIzODU4IDEuNzkwODYgMCA0IDBaIiBmaWxsPSIjNDk0OTQ5Ii8+Cjwvc3ZnPgo=" width="8" height="14" style="width: 6px; left: 23px; top: 137px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTkiIHZpZXdCb3g9IjAgMCAyMCAxOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggaWQ9IlVuaW9uIiBkPSJNNi4xNDM3NCAwLjM0NDgxMUM2LjUwNTYxIC0wLjA3MjE2MDUgNy4xMzY3OCAtMC4xMTczNjkgNy41NTM5IDAuMjQ0MjI1TDE4LjEyODEgOS40MjA5OEMxOC4xODU1IDkuNDcwODQgMTguMjM1MyA5LjUyNjIzIDE4LjI3ODUgOS41ODUwNUMxOC40MjY2IDkuNjcxNTQgMTguNTY4OSA5Ljc2OTk1IDE4LjcwMjMgOS44ODI5QzIwLjM4ODYgMTEuMzEgMjAuMTc4NCAxNC4zMjk5IDE4LjIzMzYgMTYuNjI4QzE2LjI4ODggMTguOTI2MSAxMy4zNDU3IDE5LjYzMjIgMTEuNjU5NCAxOC4yMDUyQzExLjU2NzEgMTguMTI3MSAxMS40ODE1IDE4LjA0MzQgMTEuNDAwNiAxNy45NTYxQzExLjIyNzggMTcuOTI1OSAxMS4wNjAzIDE3Ljg1MTkgMTAuOTE4MiAxNy43Mjg2TDAuMzQ0OTEyIDguNTUxODRDLTAuMDcyMTI3NiA4LjE4OTkyIC0wLjExNzQ2IDcuNTU4OCAwLjI0NDMyNiA3LjE0MTY5TDYuMTQzNzQgMC4zNDQ4MTFaIiBmaWxsPSIjNDk0OTQ5Ii8+Cjwvc3ZnPgo=" width="19" height="18" style="width: 14.8415px; left: 36.411px; top: 206.411px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IkVsbGlwc2UgMzgiPgo8cGF0aCBkPSJNMTIgNkMxMiA5LjMxMzcxIDkuMzEzNzEgMTIgNiAxMkMyLjY4NjI5IDEyIDAgOS4zMTM3MSAwIDZDMCAyLjY4NjI5IDIuNjg2MjkgLTcuMjI0NDllLTA3IDYgLTcuMjI0NDllLTA3QzkuMzEzNzEgLTcuMjI0NDllLTA3IDEyIDIuNjg2MjkgMTIgNloiIGZpbGw9IiM2NjY2NjYiLz4KPHBhdGggZD0iTTEyIDZDMTIgOS4zMTM3MSA5LjMxMzcxIDEyIDYgMTJDMi42ODYyOSAxMiAwIDkuMzEzNzEgMCA2QzAgMi42ODYyOSAyLjY4NjI5IC03LjIyNDQ5ZS0wNyA2IC03LjIyNDQ5ZS0wN0M5LjMxMzcxIC03LjIyNDQ5ZS0wNyAxMiAyLjY4NjI5IDEyIDZaIiBmaWxsPSIjNjY2NjY2Ii8+CjxwYXRoIGQ9Ik0xMiA2QzEyIDkuMzEzNzEgOS4zMTM3MSAxMiA2IDEyQzIuNjg2MjkgMTIgMCA5LjMxMzcxIDAgNkMwIDIuNjg2MjkgMi42ODYyOSAtNy4yMjQ0OWUtMDcgNiAtNy4yMjQ0OWUtMDdDOS4zMTM3MSAtNy4yMjQ0OWUtMDcgMTIgMi42ODYyOSAxMiA2WiIgZmlsbD0iIzY2NjY2NiIvPgo8L2c+Cjwvc3ZnPgo=" width="12" height="12" style="width: 12px; left: 104px; top: 197px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBpZD0iRWxsaXBzZSAzOSIgY3g9IjYiIGN5PSI2IiByPSI2IiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=" width="12" height="12" style="width: 12px; left: 80px; top: 197px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iRWxsaXBzZSA0MCIgZD0iTTYgM0M2IDQuNjU2ODUgNC42NTY4NSA2IDMgNkMxLjM0MzE1IDYgMCA0LjY1Njg1IDAgM0MwIDEuMzQzMTUgMS4zNDMxNSAwIDMgMEM0LjY1Njg1IDAgNiAxLjM0MzE1IDYgM1oiIGZpbGw9IiNFMkUyRTIiLz4KPC9zdmc+Cg==" width="6" height="6" style="width: 6px; left: 83px; top: 200px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iRWxsaXBzZSA0MSIgZD0iTTYgM0M2IDQuNjU2ODUgNC42NTY4NSA2IDMgNkMxLjM0MzE1IDYgMCA0LjY1Njg1IDAgM0MwIDEuMzQzMTUgMS4zNDMxNSAwIDMgMEM0LjY1Njg1IDAgNiAxLjM0MzE1IDYgM1oiIGZpbGw9IiNFMkUyRTIiLz4KPC9zdmc+Cg==" width="6" height="6" style="width: 6px; left: 107px; top: 200px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI0IiB2aWV3Qm94PSIwIDAgNiA0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iUG9seWdvbiAxIiBkPSJNMi41OTk0IDMuMzc1QzMuNTk5NCAzLjM3NSA1LjA5OTQgMC44NzUgNS4xOTc0NyAwLjM3NUM1LjI5NTU1IC0wLjEyNSAtMC4wOTY3NTQgLTAuMTI1IDAuMDAxMzIxODkgMC4zNzVDMC4wOTkzOTc4IDAuODc1IDEuNTk5NCAzLjM3NSAyLjU5OTQgMy4zNzVaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=" width="5" height="3" style="width: 5.1988px; left: 96px; top: 209.625px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB2aWV3Qm94PSIwIDAgMiAyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBpZD0iUG9seWdvbiAyIj4KPHBhdGggZD0iTTAuMTM2MjcxIDJDLTAuMzYzNzMgMiAwLjYzNjI3MSA3LjY0NjhlLTA3IDEuMTM2MjcgNi43ODcyZS0wN0MxLjYzNjI3IDUuOTI3NmUtMDcgMS42MzYyNyA1LjE5MDU5ZS0wNyAxLjYzNjI3IDAuNTAwMDAxQzEuNjM2MjcgMSAwLjYzNjI3MSAyIDAuMTM2MjcxIDJaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik0wLjEzNjI3MSAyQy0wLjM2MzczIDIgMC42MzYyNzEgNy42NDY4ZS0wNyAxLjEzNjI3IDYuNzg3MmUtMDdDMS42MzYyNyA1LjkyNzZlLTA3IDEuNjM2MjcgNS4xOTA1OWUtMDcgMS42MzYyNyAwLjUwMDAwMUMxLjYzNjI3IDEgMC42MzYyNzEgMiAwLjEzNjI3MSAyWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L2c+Cjwvc3ZnPgo=" width="1" height="2" style="width: 1.63627px; left: 111.364px; top: 198px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMiAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBpZD0iUG9seWdvbiAzIj4KPHBhdGggZD0iTTAuMDM2NTExNCAwLjY4OTA1Qy0wLjE4MTQzOCAwLjU5MzA0NCAwLjYzODQ4MiAtMC4wODY3NDI3IDAuODU2NDMxIDAuMDA5MjYyNTRDMS4wNzQzOCAwLjEwNTI2OCAxLjA3NDM4IDAuMTA1MjY4IDAuOTc4Mzc1IDAuMzIzMjE3QzAuODgyMzcgMC41NDExNjcgMC4yNTQ0NjEgMC43ODUwNTUgMC4wMzY1MTE0IDAuNjg5MDVaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik0wLjAzNjUxMTQgMC42ODkwNUMtMC4xODE0MzggMC41OTMwNDQgMC42Mzg0ODIgLTAuMDg2NzQyNyAwLjg1NjQzMSAwLjAwOTI2MjU0QzEuMDc0MzggMC4xMDUyNjggMS4wNzQzOCAwLjEwNTI2OCAwLjk3ODM3NSAwLjMyMzIxN0MwLjg4MjM3IDAuNTQxMTY3IDAuMjU0NDYxIDAuNzg1MDU1IDAuMDM2NTExNCAwLjY4OTA1WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L2c+Cjwvc3ZnPgo=" width="1" height="0" style="width: 1.0397px; left: 123.289px; top: 198.833px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB2aWV3Qm94PSIwIDAgMiAyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBpZD0iUG9seWdvbiA0Ij4KPHBhdGggZD0iTTAuMTM2MjcxIDJDLTAuMzYzNzMgMiAwLjYzNjI3MSA3LjY0NjhlLTA3IDEuMTM2MjcgNi43ODcyZS0wN0MxLjYzNjI3IDUuOTI3NmUtMDcgMS42MzYyNyA1LjE5MDU5ZS0wNyAxLjYzNjI3IDAuNTAwMDAxQzEuNjM2MjcgMSAwLjYzNjI3MSAyIDAuMTM2MjcxIDJaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik0wLjEzNjI3MSAyQy0wLjM2MzczIDIgMC42MzYyNzEgNy42NDY4ZS0wNyAxLjEzNjI3IDYuNzg3MmUtMDdDMS42MzYyNyA1LjkyNzZlLTA3IDEuNjM2MjcgNS4xOTA1OWUtMDcgMS42MzYyNyAwLjUwMDAwMUMxLjYzNjI3IDEgMC42MzYyNzEgMiAwLjEzNjI3MSAyWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L2c+Cjwvc3ZnPgo=" width="1" height="2" style="width: 1.63627px; left: 87.744px; top: 198px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMiAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBpZD0iUG9seWdvbiA1Ij4KPHBhdGggZD0iTTAuMDM2NTExNCAwLjY4OTA1Qy0wLjE4MTQzOCAwLjU5MzA0NCAwLjYzODQ4MiAtMC4wODY3NDI2IDAuODU2NDMxIDAuMDA5MjYyNTZDMS4wNzQzOCAwLjEwNTI2OCAxLjA3NDM4IDAuMTA1MjY4IDAuOTc4Mzc1IDAuMzIzMjE3QzAuODgyMzcgMC41NDExNjcgMC4yNTQ0NjEgMC43ODUwNTUgMC4wMzY1MTE0IDAuNjg5MDVaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik0wLjAzNjUxMTQgMC42ODkwNUMtMC4xODE0MzggMC41OTMwNDQgMC42Mzg0ODIgLTAuMDg2NzQyNiAwLjg1NjQzMSAwLjAwOTI2MjU2QzEuMDc0MzggMC4xMDUyNjggMS4wNzQzOCAwLjEwNTI2OCAwLjk3ODM3NSAwLjMyMzIxN0MwLjg4MjM3IDAuNTQxMTY3IDAuMjU0NDYxIDAuNzg1MDU1IDAuMDM2NTExNCAwLjY4OTA1WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L2c+Cjwvc3ZnPgo=" width="1" height="0" style="width: 1.0397px; left: 89.669px; top: 198.11px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDYgMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGlkPSJQb2x5Z29uIDYiIGQ9Ik0yLjU5ODUgMTEuMjAwMkMyLjMwNzEzIDExLjIwMDIgMi4wNDQyMiAxMS4wMzY0IDEuODA3NDggMTAuNzM1NEMxLjU3MDcxIDEwLjQzNDEgMS4zNjM5NCAxMC4wMDA0IDEuMTg0NDMgOS40NzU1OUMwLjgyNTUwNyA4LjQyNjA1IDAuNTc5MzY1IDcuMDI0MiAwLjQxMDk5NSA1LjYxOTE0QzAuMjQyNzAxIDQuMjE0NjkgMC4xNTI1ODQgMi44MDk4MiAwLjEwNDM1NSAxLjc1NTg2QzAuMDgwMjUxNiAxLjIyOTA3IDAuMDY2OTkxNSAwLjc4OTczIDAuMDU5NDMzIDAuNDgyNDIyQzAuMDU1NjYxMSAwLjMyOTAzNyAwLjA1Mjk0OCAwLjIwODIzMyAwLjA1MTYyMDUgMC4xMjU5NzdDMC4wNTExMjU2IDAuMDk1Mjg3OSAwLjA1MDkwNSAwLjA2OTUwODQgMC4wNTA2NDM5IDAuMDQ5ODA0N0g1LjE0NTM3QzUuMTQ1MTEgMC4wNjk1MDgyIDUuMTQ0ODkgMC4wOTUyODg5IDUuMTQ0MzkgMC4xMjU5NzdDNS4xNDMwNyAwLjIwODIzMyA1LjE0MTMzIDAuMzI5MDM4IDUuMTM3NTYgMC40ODI0MjJDNS4xMyAwLjc4OTczMSA1LjExNTc2IDEuMjI5MDYgNS4wOTE2NiAxLjc1NTg2QzUuMDQzNDMgMi44MDk4MiA0Ljk1MzMxIDQuMjE0NjkgNC43ODUwMiA1LjYxOTE0QzQuNjE2NjUgNy4wMjQyMiA0LjM3MDUxIDguNDI2MDUgNC4wMTE1OCA5LjQ3NTU5QzMuODMyMDYgMTAuMDAwNCAzLjYyNTMyIDEwLjQzNDEgMy4zODg1MyAxMC43MzU0QzMuMTUxOTEgMTEuMDM2MiAyLjg4OTY5IDExLjIgMi41OTg1IDExLjIwMDJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjAuMSIvPgo8L3N2Zz4K" width="5" height="11" style="width: 5.19615px; left: 96px; top: 213px; position: absolute;" alt="音乐">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNSIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgNSA5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iVmVjdG9yIDE2IiBkPSJNMi4zNTEwNiA4LjA1QzQuMzUxMDcgOC4wNSA0LjY1MTA2IDEuMDUgNC42NTEwNiAxLjA1QzQuNjUxMDYgMS4wNSAzLjM1MTA3IDAuMDUgMi4zNTEwNyAwLjA1QzEuMzUxMDcgMC4wNSAwLjA1MTA2MzUgMS4wNSAwLjA1MTA2MzUgMS4wNUMwLjA1MTA2MzUgMS4wNSAwLjM1MTA2IDguMDUgMi4zNTEwNiA4LjA1WiIgZmlsbD0iI0ZGMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjY1IiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMC4xIi8+Cjwvc3ZnPgo=" width="4" height="8" style="width: 4.70213px; left: 96px; top: 215px; position: absolute;" alt="音乐">
          </div>
        </div>
      </div>
    `,
    css: `
      .phone-container{
        --phone-border:#261503;
        --text-color:#ffffff;
        width:min(95vw,360px);
        height:min(85vh,640px);
        border:8px solid var(--phone-border);
        border-radius:36px;
        background-size:cover;
        background-position:center;
        position:relative;
        overflow:hidden;
      }
      .widget-container {
        position: absolute;
        top: 50px;
        left: 12px;
        right: 12px;
        z-index: 1;
      }
      .widget .time { font-size: 34px; font-weight: bold; line-height: 1.1; }
      .widget .date { font-size: 13px; opacity: 0.9; }
      .widget .weather { font-size: 15px; opacity: 0.95; margin-top: 4px; }
      .app-1 {
        position: absolute;
        top: 115px;
        left: 190px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }
      .app-2 {
        position: absolute;
        top: 210px;
        left: 190px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }
      .app-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: transparent;
        border-radius: 12px;
        padding: 8px 4px;
        transition: transform 0.2s;
        cursor: pointer;
        min-height: 70px;
      }
      .app-block:hover { transform: scale(1.05); }
      .app-block img {
        width: 60px;
        height: 60px;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 14px;
        object-fit: cover;
      }
      .app-block span {
        font-size: 18px;
        color: var(--text-color);
        text-align: center;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }
      .app-3 {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 10px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        background: transparent;
        border-top: none;
      }
      .app-3 .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      }
      .app-3 .app:hover { transform: scale(1.05); }
      .app-3 .app img {
        width: 60px;
        height: 60px;
        background-color: rgba(255,255,255,0.9);
        border-radius: 14px;
        object-fit: cover;
      }
      .app-3 .app span {
        font-size: 18px;
        color: var(--text-color);
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }
      .app-4 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* 防止遮挡其他点击 */
      }
      .app-4 > div {
        pointer-events: auto;
      }

      /* ===== theme1 移动端微调，不影响PC端 ===== */
      .phone-container {
        --mobile-app1-top: 115px;
        --mobile-app1-left: 190px;

        --mobile-app2-top: 210px;
        --mobile-app2-left: 190px;

        --record-x: 0px;
        --record-y: 0px;
        --record-scale: 1;
      }

      /* 唱片整体控制 */
      .app-4 {
        transform: translate(var(--record-x), var(--record-y)) scale(var(--record-scale));
        transform-origin: top left;
      }

      /* 手机端才生效 */
      @media (max-width: 430px) {
        .phone-container {
          --mobile-app1-top: 19%;
          --mobile-app1-left: 53%;

          --mobile-app2-top: 33%;
          --mobile-app2-left: 53%;

          --record-x: 18px;
          --record-y: 28px;
          --record-scale: 0.8;
        }

        .app-1 {
          top: var(--mobile-app1-top);
          left: var(--mobile-app1-left);
          width: 38%;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .app-2 {
          top: var(--mobile-app2-top);
          left: var(--mobile-app2-left);
          width: 38%;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .app-block {
          padding: 4px 2px;
          min-height: 56px;
        }

        .app-block img {
          width: 44px;
          height: 44px;
          border-radius: 12px;
        }

        .app-block span {
          font-size: 12px;
          margin-top: 3px;
        }

        .app-3 {
          left: 12px;
          right: 12px;
          bottom: 8px;
        }

        .app-3 .app img {
          width: 46px;
          height: 46px;
          border-radius: 12px;
        }

        .app-3 .app span {
          font-size: 12px;
        }
      }
    `
  }
};
let currentUploadImage = '';
let currentActiveContactId = '';
let currentChatId = '';
let currentChatType = 'direct';
let currentContactTab = 'direct';
let currentCallId = '';
let currentIncomingCallId = '';
let currentMessageAction = null;
let currentStickerImportMode = 'file';
let currentSendImageData = '';
let currentFeedImages = [];

let contactList = [];
let groupList = [];
let feedPosts = [];
let messages = {};
let callLogs = {};
let chatSettings = {};
let stickerPacks = [];
let relationshipSettings = {};

let appProfile = {
  myName: '我',
  myAvatar: '',
  feedCover: ''
};

let composerDraft = {
  quote: null,
  attachments: []
};

let pendingReplyTargets = {};
let pendingVVChatSyncQueue = [];
let vvAppReady = false;

let myProfile = {
  avatar: '',
  nickname: '我',
  avatarUnified: false,
  backgroundUnified: false,
  globalChatBg: ''
};

let walletData = {
  balance: 0
};

let stickerManageMode = false;
let stickerPressTimer = null;
let stickerRenameId = null;
let stickerRenameDraft = '';
// 通话状态管理
let currentCallPhase = 'idle'; // idle | calling | ringing | talking | ended
let callStartTimestamp = null;
let callStartTime = null;
let callTimerInterval = null;
let isWaitingCallAIReply = false;
let callTranscript = [];

let lastHandledFeedHiddenRawSig = '';
let lastHandledFeedHiddenRawAt = 0;

function getVVFeedHiddenRawSig(raw) {
  raw = String(raw || '');

  var hiddenMatch = raw.match(
    /(<div class="vv-feed-hidden"[\s\S]*?<\/div>)/g
  );

  return hiddenMatch ? hiddenMatch.join('') : raw;
}

function shouldSkipDuplicateFeedHiddenRaw(raw) {
  var sig = getVVFeedHiddenRawSig(raw);
  var now = Date.now();

  if (!sig) return true;

  if (sig === lastHandledFeedHiddenRawSig && now - lastHandledFeedHiddenRawAt < 5000) {
    console.log('[VV][FEED] skip duplicated VV_FEED_HIDDEN_RAW');
    return true;
  }

  lastHandledFeedHiddenRawSig = sig;
  lastHandledFeedHiddenRawAt = now;

  return false;
}

const VV_STATE_SYNC_CHANNEL_NAME = 'VV_PHONE_STATE_SYNC_V1';

let vvStateBroadcastChannel = null;
let vvStateBroadcastMuteUntil = 0;

try {
  vvStateBroadcastChannel = new BroadcastChannel(VV_STATE_SYNC_CHANNEL_NAME);

  vvStateBroadcastChannel.onmessage = function (event) {
    var data = event.data || {};

    if (!data || data.type !== 'VV_STATE_CHANGED') return;

    // 避免自己刚保存后立刻重复刷新
    if (Date.now() < vvStateBroadcastMuteUntil) return;

    console.log('[VV][STATE_SYNC] received state changed:', data.reason);

    try {
      if (typeof loadAll === 'function') {
        loadAll();
      }

      if (typeof renderCurrentView === 'function') {
        renderCurrentView();
      } else {
        // 兜底刷新当前可见页面
        if (typeof renderContactList === 'function') renderContactList();
        if (typeof renderChatList === 'function') renderChatList();
        if (typeof renderFeedList === 'function') renderFeedList();
        if (typeof renderMessages === 'function' && window.currentChatId) renderMessages();
      }
    } catch (err) {
      console.warn('[VV][STATE_SYNC] reload/render failed:', err);
    }
  };
} catch (err) {
  console.warn('[VV][STATE_SYNC] BroadcastChannel unavailable:', err);
}

function broadcastVVStateChanged(reason) {
  try {
    vvStateBroadcastMuteUntil = Date.now() + 300;

    if (vvStateBroadcastChannel) {
      vvStateBroadcastChannel.postMessage({
        type: 'VV_STATE_CHANGED',
        reason: reason || '',
        time: Date.now()
      });
    }
  } catch (err) {
    console.warn('[VV][STATE_SYNC] broadcast failed:', err);
  }
}

var diaryData =
JSON.parse(
  localStorage.getItem('st_diary_data')
  || '{"diaries":[]}'
);
var currentDiaryAction = 'view';

// 在 VV_BRIDGE_CONFIG 中新增 buildCallEventCommand（不要删除原来的 buildCallCommand）
// 找到 VV_BRIDGE_CONFIG 对象，在 buildCallCommand 后面加上这个新方法：

// ==================== 图片裁剪功能模块 ====================
let currentCropper = null;
let cropCallback = null;

let currentTransferMessageRef = null;
let currentTransferChatId = null;

/**
 * 打开裁剪弹窗
 * @param {string} dataUrl - 原图的 DataURL
 * @param {number} aspectRatio - 裁剪比例 (头像 1, 背景 16/9)
 * @param {function} callback - 裁剪完成后的回调，传回新的 DataURL
 */

const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI2IiBmaWxsPSIjMDdjMTYwIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIxOCIgcj0iNiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTIgMzRDMTIgMjcuMzcyMyAxNy4zNzIzIDIyIDI0IDIyQzMwLjYyNzcgMjIgMzYgMjcuMzcyMyAzNiAzNEgxMloiIGZpbGw9IndoaXRlIi8+PC9zdmc+';

const STORAGE_DEBUG = true;
const STORAGE_SOFT_LIMIT = 4.5 * 1024 * 1024;
const STORAGE_IMAGE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIHJ4PSIxNiIgZmlsbD0iI2YxZjFmMSIvPjxwYXRoIGQ9Ik00MCAxMTBMMTYwIDUwVjE0MEgyMFY5MEw0MCAxMTBaIiBmaWxsPSIjZGRkIi8+PGNpcmNsZSBjeD0iNTgiIGN5PSI1OCIgcj0iMTIiIGZpbGw9IiNjY2MiLz48L3N2Zz4=';

const IDB_DB_NAME = 'vv_phone_assets_db';
const IDB_DB_VERSION = 1;
const IDB_STORE_NAME = 'assets';
const IDB_REF_PREFIX = 'idb:';
const assetObjectUrlCache = new Map();

const VV_BRIDGE_CONFIG = {
  enabled: true,
  debug: true,
  chatMode: 'local+slash',
  callMode: 'local+slash',
  feedMode: 'local+slash',

  buildReplyCommand: function (params) {
    const bridgeName = params.bridgeName;
    const chatId = params.chatId;
    const chatType = params.chatType;
    const promptText = params.promptText;
    const scope = chatType === 'group' ? '[群聊回复]' : '[私聊回复]';

    const cmd =
      '/send ' + bridgeName +
      '\n' + scope +
      '\n聊天ID:' + chatId +
      '\n' + promptText +
      '\n|/trigger';

    console.log('[VV_BRIDGE_CONFIG][buildReplyCommand]', {
      bridgeName,
      chatId,
      chatType,
      scope,
      promptLength: String(promptText || '').length
    });
    console.log('[VV_BRIDGE_CONFIG][buildReplyCommand][CMD_BEGIN]');
    console.log(cmd);
    console.log('[VV_BRIDGE_CONFIG][buildReplyCommand][CMD_END]');

    return cmd;
  },

  buildCallCommand: function (params) {
    const bridgeName = params.bridgeName;
    const promptText = params.promptText;

    const cmd =
      '/send ' + bridgeName +
      '\n[电话模式]' +
      '\n' + promptText +
      '\n|/trigger';

    console.log('[VV_BRIDGE_CONFIG][buildCallCommand]', {
      bridgeName,
      promptLength: String(promptText || '').length
    });
    console.log('[VV_BRIDGE_CONFIG][buildCallCommand][CMD_BEGIN]');
    console.log(cmd);
    console.log('[VV_BRIDGE_CONFIG][buildCallCommand][CMD_END]');

    return cmd;
  },

  buildFeedCommentCommand: function (opts) {
    const postId = opts.postId || '';
    const promptText = opts.promptText || '';

    const lines = [
      '【系统指令·朋友圈评论回复·严格遵守】',
      '',
      '⚠️ 这是朋友圈评论互动，不是电话，不是私聊。',
      '⚠️ 禁止输出 [VV_CALL_SYNC]。',
      '⚠️ 禁止输出 [VV_CHAT_SYNC]。',
      '⚠️ 禁止输出 [VV_INCOMING_CALL]。',
      '⚠️ 禁止输出 callPhase 或 [通话] 块。',
      '⚠️ 禁止模拟用户（维夏/"我"）的回复，from 不能是维夏或我。',
      '⚠️ 禁止输出任何解释、旁白、正文叙事。',
      'replyTo= 必须作为独立一行，不可以写在 content= 的值里面。content= 只包含纯回复文字。',
      '',
      promptText,
      '',
      '严格按以下格式输出，只输出一个 [VV_FEED_SYNC] 块：',
      '',
      '[VV_FEED_SYNC]',
      'postId=' + postId,
      'time=当前时间',
      '',
      '[互动]',
      'from=角色名',
      'action=comment',
      'content=回复内容',
      'replyTo=用户名',
      '[/互动]',
      '',
      '[/VV_FEED_SYNC]'
    ];

    const payload = lines.join('\n');
    const cmd = '/inject id=vv_feed role=system depth=0 scan=true [[\n' + payload + '\n]] |\n/trigger';
    return cmd;
  },

  buildAnnotationReplyCommand: function (params) {
    const bridgeName = params.bridgeName || '西西';
    const chatId = params.chatId || '';
    const promptText = params.promptText || '';

    const lines = [
      '【系统指令·日记标注回复·严格遵守】',
      '',
      '⚠️ 这是日记段落标注回复，不是电话，不是私聊，不是朋友圈。',
      '⚠️ 禁止输出 [VV_CALL_SYNC]。',
      '⚠️ 禁止输出 [VV_CHAT_SYNC]。',
      '⚠️ 禁止输出 [VV_FEED_SYNC]。',
      '⚠️ 禁止输出 [VV_DIARY_SYNC]。',
      '⚠️ 禁止输出 [VV_INCOMING_CALL]。',
      '⚠️ 禁止输出任何 callPhase、[通话] 块、[聊天界面] 块。',
      '⚠️ 禁止模拟用户（维夏/"我"）的回复。',
      '⚠️ 禁止输出任何解释、旁白、正文叙事、额外内容。',
      '',
      '只允许输出一个 [VV_ANNOTATION_SYNC] 块。',
      'sender= 必须写真实角色名，不能是维夏或我。',
      'content= 只包含纯回复文字。',
      '',
      promptText,
      '',
      '严格按以下格式输出，只输出一个 [VV_ANNOTATION_SYNC] 块：',
      '',
      '[VV_ANNOTATION_SYNC]',
      'diaryId=diary_xxxx',
      'annotationId=anno_xxxx',
      '',
      '[回复]',
      'sender=角色名',
      'content=回复内容',
      '[/回复]',
      '',
      '[/VV_ANNOTATION_SYNC]'
    ];

    const payload = lines.join('\n');
    const cmd =
      '/inject id=vv_annotation_' + Date.now() +
      ' role=system depth=0 scan=true [[\n' +
      payload +
      '\n]] |\n/trigger';

    console.log('[VV_BRIDGE_CONFIG][buildAnnotationReplyCommand]', {
      bridgeName,
      chatId,
      promptLength: String(promptText || '').length
    });
    console.log('[VV_BRIDGE_CONFIG][buildAnnotationReplyCommand][CMD_BEGIN]');
    console.log(cmd);
    console.log('[VV_BRIDGE_CONFIG][buildAnnotationReplyCommand][CMD_END]');

    return cmd;
  },

  buildFeedEventCommand: function (opts) {
    const postId = opts.postId || '';
    const content = opts.content || '';
    const images = opts.images || [];
    const author = opts.author || '我';
    const bridgeName = opts.bridgeName || author;

    let promptText = '';

    if (opts.isAiPost) {
      promptText = buildVVFeedAiPostPayload(postId, author, bridgeName);
    } else {
      promptText = buildVVFeedEventPayload(postId, content, images, author);
    }

    const cmd = '/send ' + promptText + '\n|\n/trigger';
    return cmd;
  },

  buildCallEventCommand: function (opts) {
    const bridgeName = opts.bridgeName || '';
    const chatId = opts.chatId || '';
    const callPhase = opts.callPhase || 'calling';
    const promptText = opts.promptText || '';

    // 构建注入的电话上下文内容
    var callContext = '[电话模式]\n' +
      '通话阶段:' + callPhase + '\n' +
      '聊天ID:' + chatId + '\n' +
      promptText;

    // 用换行隔开，避免内容中的 ] 和外层 ]] 粘连
    var cmd = '/inject id=vv_call role=system depth=0 scan=true [[\n' + callContext + '\n]] |\n/trigger';

    return cmd;
  },

  buildCallReplyCommand: function (opts) {
    const bridgeName = opts.bridgeName || '';
    const chatId = opts.chatId || '';
    const callPhase = opts.callPhase || 'reply';
    const promptText = opts.promptText || '';

    var callContext = '[电话模式]\n' +
      '通话阶段:' + callPhase + '\n' +
      '聊天ID:' + chatId + '\n' +
      promptText;

    var cmd = '/inject id=vv_call role=system depth=0 scan=true [[\n' + callContext + '\n]] |\n/trigger';

    return cmd;
  }
};

(function installVVBridge(global) {
  if (!global) return;

  if (global.VVBridge && global.VVBridge.__installed) {
    console.log('[VVBridge] already installed');
    return;
  }

  function getHostFrame() {
    const frames = document.querySelectorAll('iframe');
    if (!frames || !frames.length) {
      console.warn('[VVBridge] no iframe found');
      return null;
    }

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      try {
        if (frame && frame.contentWindow) {
          return frame;
        }
      } catch (err) {
        console.warn('[VVBridge] iframe access failed at index =', i, err);
      }
    }

    console.warn('[VVBridge] no usable iframe found');
    return null;
  }

  function safeText(value) {
    return String(value == null ? '' : value);
  }

  function extractChatId(raw) {
    const text = safeText(raw);
    return ((text.match(/(?:^|\n)chatId=([^\n\r]+)/) || [])[1] || '').trim();
  }

  function buildChatSyncRaw(data) {
    data = data || {};
    const messages = Array.isArray(data.messages) ? data.messages : [];

    const lines = [
      '[VV_CHAT_SYNC]',
      'chatId=' + safeText(data.chatId),
      'target=' + safeText(data.target),
      'time=' + safeText(data.time),
      'myAvatarKey=' + safeText(data.myAvatarKey || 'current_my_avatar'),
      'targetAvatarId=' + safeText(data.targetAvatarId),
      'myBubble=' + safeText(data.myBubble || '#5B86FF'),
      'targetBubble=' + safeText(data.targetBubble || '#F8F8F8'),
      'chatBgKey=' + safeText(data.chatBgKey || 'current_chat_bg'),
      ''
    ];

    messages.forEach(function (msg) {
      msg = msg || {};
      lines.push('[消息]');
      lines.push('side=' + safeText(msg.side || 'left'));
      lines.push('sender=' + safeText(msg.sender));
      lines.push('content=' + safeText(msg.content));
      lines.push('state=' + safeText(msg.state || 'sent'));

      if (msg.type) {
        lines.push('type=' + safeText(msg.type));
      }
      if (msg.transferAction) {
        lines.push('transferAction=' + safeText(msg.transferAction));
      }
      if (msg.transferAmount) {
        lines.push('transferAmount=' + safeText(msg.transferAmount));
      }
      if (msg.transferNote) {
        lines.push('transferNote=' + safeText(msg.transferNote));
      }

      lines.push('[/消息]');
      lines.push('');
    });

    lines.push('[/VV_CHAT_SYNC]');
    return lines.join('\n');
  }

  function forwardRaw(raw, extra) {
    extra = extra || {};

    const frame = getHostFrame();
    if (!frame || !frame.contentWindow) {
      console.warn('[VVBridge.forwardRaw] host iframe not found');
      return false;
    }

    const text = safeText(raw);
    const chatId = safeText(extra.chatId || extractChatId(text));
    const payload = {
      type: 'VV_RAW_LLM_REPLY',
      raw: text,
      chatId: chatId,
      source: safeText(extra.source || 'VVBridge.forwardRaw')
    };

    try {
      frame.contentWindow.postMessage(payload, '*');
      console.log('[VVBridge.forwardRaw] sent payload =', payload);
      return true;
    } catch (err) {
      console.error('[VVBridge.forwardRaw] postMessage failed:', err);
      return false;
    }
  }

  function sendChatSync(data) {
    data = data || {};
    const raw = buildChatSyncRaw(data);

    console.log('[VVBridge.sendChatSync] data =', data);
    console.log('[VVBridge.sendChatSync][RAW_BEGIN]');
    console.log(raw);
    console.log('[VVBridge.sendChatSync][RAW_END]');

    return forwardRaw(raw, {
      chatId: data.chatId,
      source: 'VVBridge.sendChatSync'
    });
  }

  function sendMessage(options) {
    options = options || {};

    const chatId = safeText(options.chatId || ('chat_' + Date.now()));
    const target = safeText(options.target || '');
    const time = safeText(options.time || '');
    const myAvatarKey = safeText(options.myAvatarKey || 'current_my_avatar');
    const targetAvatarId = safeText(options.targetAvatarId || '');
    const myBubble = safeText(options.myBubble || '#5B86FF');
    const targetBubble = safeText(options.targetBubble || '#F8F8F8');
    const chatBgKey = safeText(options.chatBgKey || 'current_chat_bg');

    const messages = Array.isArray(options.messages)
      ? options.messages
      : [
          {
            side: safeText(options.side || 'left'),
            sender: safeText(options.sender || target),
            content: safeText(options.content || ''),
            state: safeText(options.state || 'sent'),
            type: safeText(options.type || 'text')
          }
        ];

    return sendChatSync({
      chatId: chatId,
      target: target,
      time: time,
      myAvatarKey: myAvatarKey,
      targetAvatarId: targetAvatarId,
      myBubble: myBubble,
      targetBubble: targetBubble,
      chatBgKey: chatBgKey,
      messages: messages
    });
  }

  global.VVBridge = {
    __installed: true,
    getHostFrame: getHostFrame,
    extractChatId: extractChatId,
    buildChatSyncRaw: buildChatSyncRaw,
    forwardRaw: forwardRaw,
    sendChatSync: sendChatSync,
    sendMessage: sendMessage
  };

  console.log('[VVBridge] installed successfully');
})(window);

let vvBridgeListenerInited = false;

function initSTBridgeListener() {
  if (vvBridgeListenerInited) {
    console.log('[VV] initSTBridgeListener skipped: already inited');
    return;
  }
  vvBridgeListenerInited = true;

  console.log('[VV] initSTBridgeListener called');

  window.addEventListener('message', async (event) => {
    const data = event.data || {};
    if (!data || typeof data !== 'object') return;

    console.log('[VV][listener] message event type =', data.type, 'full data =', data);

    try {
      if (data.type === 'VVPHONE_SET_VIEW') {
        if (String(data.view || '') === 'chat') {
          const chatId = String(data.chatId || '').trim();
          const target = String(data.target || '').trim();
          const chatType = String(data.chatType || 'direct').trim() || 'direct';

          console.log('[VV][listener] HIT VVPHONE_SET_VIEW(chat)', {
            chatId,
            target,
            chatType
          });

          if (chatId) {
            if (chatType === 'direct' && typeof openChatDetail === 'function') {
              await openChatDetail(chatId, target || '');
            } else if (typeof openChat === 'function') {
              await openChat(chatId, chatType);
            }
          }
        }
        return;
      }

      if (data.type === 'VVPHONE_OPEN_CHAT') {
        const chatId = String(data.chatId || '').trim();
        const target = String(data.target || '').trim();
        const chatType = String(data.chatType || 'direct').trim() || 'direct';

        console.log('[VV][listener] HIT VVPHONE_OPEN_CHAT', {
          chatId,
          target,
          chatType
        });

        if (!chatId) return;

        if (chatType === 'direct' && typeof openChatDetail === 'function') {
          await openChatDetail(chatId, target || '');
        } else if (typeof openChat === 'function') {
          await openChat(chatId, chatType);
        }
        return;
      }

      // ===== 通话同步 → 交给 NAV bridge 统一处理 =====
      if (data.type === 'VVPHONE_CALL_SYNC') {
        console.log('[VV][listener] VVPHONE_CALL_SYNC → skip, handled by NAV bridge');
        return;
      }

      // ===== AI来电 → 交给 NAV bridge 统一处理 =====
      if (data.type === 'VVPHONE_INCOMING_CALL') {
        console.log('[VV][listener] VVPHONE_INCOMING_CALL → skip, handled by NAV bridge');
        return;
      }

      // ===== 拦截器回复 → 交给 NAV bridge 统一处理 =====
      if (data.type === 'VV_CALL_AI_REPLY') {
        console.log('[VV][listener] VV_CALL_AI_REPLY → skip, handled by NAV bridge');
        return;
      }

      if (data.type === 'VVPHONE_CHAT_SYNC') {
        console.log('[VV][listener] HIT VVPHONE_CHAT_SYNC');
        console.log('[VV][SYNC][RECV_FULL]', data);
        console.log('[VV][SYNC] raw =', data.raw);

        try {
          await handleVVChatSyncRaw(data);
        } catch (err) {
          console.error('[VV][listener] handleVVChatSyncRaw error:', err);
        }
        return;
      }

      if (data.type === 'VVPHONE_DIARY_SYNC') {
        console.log('[VV][listener] VVPHONE_DIARY_SYNC → skip, handled by NAV bridge');
        return;
      }

      if (data.type === 'VV_AI_FEED_POST') {
        console.log('[VV][listener] HIT VV_AI_FEED_POST');
        handleAiFeedPost(data.payload);
        return;
      }

      if (data.type === 'VV_EXECUTE_RESULT') {
        console.log('[VV][listener] HIT VV_EXECUTE_RESULT', data);
        return;
      }
    } catch (err) {
      console.error('[VV][listener] message handler error:', err);
    }
  });
}

initSTBridgeListener();

function safeJSONParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Storage] JSON 解析失败，已使用默认值', err);
    return fallback;
  }
}

function getApproxSize(str) {
  try {
    return new Blob([str]).size;
  } catch (err) {
    return (str || '').length * 2;
  }
}

function logStorageSize(label, value) {
  if (!STORAGE_DEBUG) return;
  const size = getApproxSize(typeof value === 'string' ? value : JSON.stringify(value));
  console.log('[Storage] ' + label + ': ' + (size / 1024).toFixed(1) + ' KB');
}

function isDataImage(str) {
  return typeof str === 'string' && str.indexOf('data:image/') === 0;
}

function isIDBRef(value) {
  return typeof value === 'string' && value.indexOf(IDB_REF_PREFIX) === 0;
}

function createAssetRef(id) {
  return IDB_REF_PREFIX + id;
}

function extractAssetId(ref) {
  return isIDBRef(ref) ? ref.slice(IDB_REF_PREFIX.length) : '';
}

function keepUrlOrSmallDataImage(str, maxLen, fallback) {
  if (fallback === undefined) fallback = '';
  if (!str) return fallback;
  if (!isDataImage(str)) return str;
  return str.length <= maxLen ? str : fallback;
}

function dataURLToBlob(dataUrl) {
  const arr = String(dataUrl).split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1] || '');
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

function compressImage(dataUrl, maxWidth, quality) {
  if (maxWidth === undefined) maxWidth = 1000;
  if (quality === undefined) quality = 0.72;

  return new Promise(function (resolve) {
    if (!dataUrl || String(dataUrl).indexOf('data:image/') !== 0) {
      resolve(dataUrl || '');
      return;
    }

    const img = new Image();
    img.onload = function () {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const hasAlpha = /^data:image\/png|^data:image\/webp/i.test(dataUrl);
      if (hasAlpha) resolve(canvas.toDataURL('image/png'));
      else resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = function () {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

function openAssetsDB() {
  return new Promise(function (resolve, reject) {
    const req = indexedDB.open(IDB_DB_NAME, IDB_DB_VERSION);

    req.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
      }
    };

    req.onsuccess = function () {
      resolve(req.result);
    };

    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function idbPutAsset(record) {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);

    tx.oncomplete = function () {
      resolve(record.id);
    };

    tx.onerror = function () {
      reject(tx.error || new Error('idbPutAsset transaction failed'));
    };

    tx.onabort = function () {
      reject(tx.error || new Error('idbPutAsset transaction aborted'));
    };

    store.put(record);
  });
}

async function idbGetAsset(id) {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.get(id);

    req.onsuccess = function () {
      resolve(req.result || null);
    };

    req.onerror = function () {
      reject(req.error || new Error('idbGetAsset request failed'));
    };

    tx.onerror = function () {
      reject(tx.error || new Error('idbGetAsset transaction failed'));
    };

    tx.onabort = function () {
      reject(tx.error || new Error('idbGetAsset transaction aborted'));
    };
  });
}

async function idbDeleteAsset(id) {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = function () {
      resolve(true);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function idbGetAllAssetIds() {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(IDB_STORE_NAME);

    if (typeof store.getAllKeys === 'function') {
      const req = store.getAllKeys();
      req.onsuccess = function () {
        resolve(req.result || []);
      };
      req.onerror = function () {
        reject(req.error);
      };
      return;
    }

    const ids = [];
    const req = store.openCursor();
    req.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        ids.push(cursor.key);
        cursor.continue();
      } else {
        resolve(ids);
      }
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function persistImageToIDB(dataUrl, meta) {
  if (meta === undefined) meta = {};
  if (!dataUrl) return '';
  if (isIDBRef(dataUrl)) return dataUrl;
  if (!isDataImage(dataUrl)) return dataUrl;

  const blob = dataURLToBlob(dataUrl);
  const id = 'asset_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

  await idbPutAsset({
    id,
    blob,
    mime: blob.type || 'image/jpeg',
    createdAt: Date.now(),
    meta: meta || {}
  });

  const saved = await idbGetAsset(id);
  if (!saved || !saved.blob) {
    console.error('[persistImageToIDB] 写入后回读失败:', id, saved);
    return '';
  }

  return createAssetRef(id);
}

async function handleProfileAvatarFile(fileOrDataUrl) {
  let dataUrl = '';

  if (typeof fileOrDataUrl === 'string') {
    dataUrl = fileOrDataUrl;
  } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
    dataUrl = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result || '');
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  if (!dataUrl) return;

  let finalSrc = dataUrl;
  if (typeof persistImageToIDB === 'function') {
    finalSrc = await persistImageToIDB(dataUrl, {
      area: 'profile.avatar'
    });
  }

  setMyProfileAvatar(finalSrc);
}

function handleProfileAvatarCrop(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target?.result;
    if (!dataUrl) return;
    // 拦截！打开裁剪框，比例 1:1
    openCropDialog(dataUrl, 1, (croppedUrl) => {
      handleProfileAvatarFile(croppedUrl); // 裁剪后走原存储
    });
  };
  reader.readAsDataURL(file);
}

async function handleGlobalBgFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async e => {
    const dataUrl = e.target?.result;
    if (!dataUrl) return;

    let finalSrc = dataUrl;
    if (typeof persistImageToIDB === 'function') {
      finalSrc = await persistImageToIDB(dataUrl, {
        area: 'profile.globalBg'
      });
    }

    ensureProfileData();
    myProfile.globalChatBg = finalSrc;
    myProfile.backgroundUnified = true;

    updateProfileUI();
    renderMessages?.();
    saveAll();
  };
  reader.readAsDataURL(file);
}

async function resolveImageRefToUrl(ref) {
  if (!ref) return '';
  if (!isIDBRef(ref)) return ref;

  if (assetObjectUrlCache.has(ref)) {
    return assetObjectUrlCache.get(ref);
  }

  const id = extractAssetId(ref);
  const record = await idbGetAsset(id);
  if (!record || !record.blob) return STORAGE_IMAGE_PLACEHOLDER;

  const objectUrl = URL.createObjectURL(record.blob);
  assetObjectUrlCache.set(ref, objectUrl);
  return objectUrl;
}

function releaseAllAssetObjectUrls() {
  assetObjectUrlCache.forEach(url => {
    try { URL.revokeObjectURL(url); } catch (err) {}
  });
  assetObjectUrlCache.clear();
}

function buildMediaSrcAttrs(ref) {
  const safe = escapeHTMLAttr(ref || '');
  return `data-media-ref="${safe}" src="${STORAGE_IMAGE_PLACEHOLDER}"`;
}

async function hydrateMediaRefs(root = document) {
  const nodes = root.querySelectorAll('[data-media-ref]');
  console.log('[hydrateMediaRefs] nodes =', nodes.length);

  for (const el of nodes) {
    const ref = el.getAttribute('data-media-ref') || '';
    console.log('[hydrateMediaRefs] ref =', ref);

    const realSrc = await resolveImageRefToUrl(ref);
    console.log('[hydrateMediaRefs] realSrc =', realSrc);

    if (realSrc) el.setAttribute('src', realSrc);
  }

  const bgNodes = root.querySelectorAll('[data-bg-ref]');
  for (const el of bgNodes) {
    const ref = el.getAttribute('data-bg-ref') || '';
    const realSrc = await resolveImageRefToUrl(ref);
    if (realSrc) el.style.backgroundImage = `url(${realSrc})`;
  }
}

function collectImageRefsFromState() {
  const refs = new Set();
  const tryAdd = value => {
    if (isIDBRef(value)) refs.add(value);
  };

  if (appProfile) {
    tryAdd(appProfile.myAvatar);
    tryAdd(appProfile.feedCover);
  }

  if (myProfile) {
    tryAdd(myProfile.avatar);
    tryAdd(myProfile.globalChatBg);
  }

  Object.values(chatSettings || {}).forEach(item => {
    if (!item) return;
    tryAdd(item.background);
    tryAdd(item.backgroundBase);
    tryAdd(item.backgroundOverride);
    tryAdd(item.myAvatar);
    tryAdd(item.myAvatarBase);
    tryAdd(item.myAvatarOverride);
    tryAdd(item.theirAvatar);
  });

  Object.values(messages || {}).forEach(list => {
    (list || []).forEach(msg => {
      tryAdd(msg.src);
    });
  });

  (feedPosts || []).forEach(post => {
    tryAdd(post.authorAvatar);
    (post.images || []).forEach(tryAdd);
  });

  (stickerPacks || []).forEach(item => {
    tryAdd(item.src);
  });

  const phoneIcons = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  Object.values(phoneIcons).forEach(tryAdd);

  return refs;
}

async function cleanupUnusedIDBAssets() {
  try {
    const usedRefs = collectImageRefsFromState();
    const usedIds = new Set([...usedRefs].map(extractAssetId).filter(Boolean));
    const allIds = await idbGetAllAssetIds();

    for (const id of allIds) {
      if (!usedIds.has(id)) await idbDeleteAsset(id);
    }
  } catch (err) {
    console.warn('[IDB] 清理未使用资源失败', err);
  }
}

async function convertLegacyImagesToIDB() {
  let changed = false;

  async function convert(value, meta = {}) {
    if (!value) return value;
    if (isIDBRef(value)) return value;
    if (!isDataImage(value)) return value;
    const next = await persistImageToIDB(value, meta);
    if (next !== value) changed = true;
    return next;
  }

  if (appProfile) {
    appProfile.myAvatar = await convert(appProfile.myAvatar, { area: 'appProfile.myAvatar' });
    appProfile.feedCover = await convert(appProfile.feedCover, { area: 'appProfile.feedCover' });
  }

  for (const id of Object.keys(chatSettings || {})) {
    const item = chatSettings[id];
    if (!item) continue;
    item.background = await convert(item.background, { area: 'chatSettings.background', chatId: id });
    item.myAvatar = await convert(item.myAvatar, { area: 'chatSettings.myAvatar', chatId: id });
    item.theirAvatar = await convert(item.theirAvatar, { area: 'chatSettings.theirAvatar', chatId: id });
  }

  for (const chatId of Object.keys(messages || {})) {
    const list = messages[chatId] || [];
    for (const msg of list) {
      if (msg.type === 'image' || msg.type === 'sticker') {
        msg.src = await convert(msg.src, { area: 'messages.src', chatId, type: msg.type });
      }
    }
  }

  for (const post of (feedPosts || [])) {
    post.authorAvatar = await convert(post.authorAvatar, { area: 'feed.authorAvatar', postId: post.id });
    if (Array.isArray(post.images)) {
      for (let i = 0; i < post.images.length; i++) {
        post.images[i] = await convert(post.images[i], { area: 'feed.images', postId: post.id, index: i });
      }
    }
  }

  for (const item of (stickerPacks || [])) {
    item.src = await convert(item.src, { area: 'sticker.src', stickerId: item.id });
  }

  const phoneIcons = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  let phoneIconsChanged = false;
  for (const key of Object.keys(phoneIcons)) {
    const next = await convert(phoneIcons[key], { area: 'phone_icons', key });
    if (next !== phoneIcons[key]) {
      phoneIcons[key] = next;
      phoneIconsChanged = true;
    }
  }
  if (phoneIconsChanged) {
    safeSetItemJSON('st_phone_icons', phoneIcons);
    changed = true;
  }

  if (changed) {
    console.warn('[IDB] 已将旧 dataURL 图片迁移到 IndexedDB');
    saveAll();
  }

  return changed;
}

function safeSetItemRaw(key, raw) {
  try {
    localStorage.setItem(key, raw);
    logStorageSize(key, raw);
    return true;
  } catch (err) {
    if (err && err.name === 'QuotaExceededError') {
      console.warn(`[Storage] ${key} 写入失败：超出 localStorage 配额`);
      return false;
    }
    throw err;
  }
}

function safeSetItemJSON(key, value) {
  return safeSetItemRaw(key, JSON.stringify(value));
}

function trimMessagesForStorage(mode = 'normal') {
  const maxPerChat = mode === 'aggressive' ? 40 : 80;
  let changed = false;

  Object.keys(messages || {}).forEach(chatId => {
    const list = Array.isArray(messages[chatId]) ? messages[chatId] : [];
    if (list.length > maxPerChat) {
      messages[chatId] = list.slice(-maxPerChat);
      changed = true;
    }

    messages[chatId] = (messages[chatId] || []).map(msg => {
      const next = { ...msg };

      if (next.type === 'image') {
        next.src = keepUrlOrSmallDataImage(next.src, mode === 'aggressive' ? 120000 : 220000, STORAGE_IMAGE_PLACEHOLDER);
      }

      if (next.type === 'sticker') {
        next.src = keepUrlOrSmallDataImage(next.src, mode === 'aggressive' ? 80000 : 140000, STORAGE_IMAGE_PLACEHOLDER);
      }

      return next;
    });
  });

  return changed;
}

function cleanupLargeState(mode = 'normal') {
  let changed = false;

  const avatarLimit = mode === 'aggressive' ? 60000 : 120000;
  const bgLimit = mode === 'aggressive' ? 120000 : 260000;
  const feedImgLimit = mode === 'aggressive' ? 100000 : 180000;
  const stickerLimit = mode === 'aggressive' ? 80000 : 140000;

  if (appProfile) {
    const oldAvatar = appProfile.myAvatar;
    const oldCover = appProfile.feedCover;

    appProfile.myAvatar = keepUrlOrSmallDataImage(appProfile.myAvatar, avatarLimit, '');
    appProfile.feedCover = keepUrlOrSmallDataImage(appProfile.feedCover, bgLimit, '');

    if (oldAvatar !== appProfile.myAvatar || oldCover !== appProfile.feedCover) changed = true;
  }

  Object.keys(chatSettings || {}).forEach(id => {
    const item = chatSettings[id];
    if (!item) return;

    const oldBg = item.background;
    const oldMy = item.myAvatar;
    const oldTheir = item.theirAvatar;

    item.background = keepUrlOrSmallDataImage(item.background, bgLimit, '');
    item.myAvatar = keepUrlOrSmallDataImage(item.myAvatar, avatarLimit, appProfile.myAvatar || DEFAULT_AVATAR);
    item.theirAvatar = keepUrlOrSmallDataImage(item.theirAvatar, avatarLimit, DEFAULT_AVATAR);

    if (oldBg !== item.background || oldMy !== item.myAvatar || oldTheir !== item.theirAvatar) changed = true;
  });

  if (Array.isArray(stickerPacks)) {
    stickerPacks = stickerPacks.map(item => {
      const old = item.src;
      const next = {
        ...item,
        src: keepUrlOrSmallDataImage(item.src, stickerLimit, STORAGE_IMAGE_PLACEHOLDER)
      };
      if (old !== next.src) changed = true;
      return next;
    });
  }

  if (Array.isArray(feedPosts)) {
    feedPosts = feedPosts.map(post => {
      const next = { ...post };
      next.authorAvatar = keepUrlOrSmallDataImage(next.authorAvatar, avatarLimit, DEFAULT_AVATAR);
      next.images = (next.images || []).map(src => keepUrlOrSmallDataImage(src, feedImgLimit, STORAGE_IMAGE_PLACEHOLDER));
      return next;
    });
  }

  if (trimMessagesForStorage(mode)) changed = true;

  return changed;
}

function migrateOversizedLegacyStorage() {
  const changed = cleanupLargeState('normal');
  if (changed) console.warn('[Storage] 检测到旧的大体积缓存，已自动瘦身一次');
}

function savePhoneIconsSafely(savedIcons) {
  const clone = { ...(savedIcons || {}) };
  Object.keys(clone).forEach(key => {
    clone[key] = keepUrlOrSmallDataImage(clone[key], 260000, '');
  });

  if (!safeSetItemJSON('st_phone_icons', clone)) {
    Object.keys(clone).forEach(key => {
      clone[key] = keepUrlOrSmallDataImage(clone[key], 120000, '');
    });
    safeSetItemJSON('st_phone_icons', clone);
  }
}

function parseVVDiarySyncBlocks(raw) {

  if (!raw) return [];

  const text = String(raw);

  const blocks = [];

  const reg =
    /\[VV_DIARY_SYNC\]([\s\S]*?)\[\/VV_DIARY_SYNC\]/g;

  let match;

  while ((match = reg.exec(text)) !== null) {

    const body = match[1] || '';

    const item =
      parseVVDiarySyncBody(body);

    if (item) {

      if (Array.isArray(item.paragraphs)) {
        item.paragraphs =
          typeof normalizeDiaryParagraphs === 'function'
            ? normalizeDiaryParagraphs(item.paragraphs)
            : item.paragraphs.map(function(p) {
                if (typeof p === 'string') return p;
                if (p && typeof p === 'object') {
                  return String(
                    p.text ||
                    p.content ||
                    p.value ||
                    p.paragraph ||
                    p.body ||
                    ''
                  );
                }
                return String(p || '');
              }).filter(Boolean);
      }
      else {
        item.paragraphs = [];
      }

      if (!item.content && item.paragraphs.length) {
        item.content = item.paragraphs.join('\n\n');
      }

      blocks.push(item);
    }

  }

  return blocks;
}

function parseVVDiarySyncBody(body) {

  const data = {
    paragraphs: []
  };

  const lines =
    String(body || '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

  lines.forEach(line => {

    const eqIndex =
      line.indexOf('=');

    if (eqIndex === -1) return;

    const key =
      line.slice(0, eqIndex).trim();

    const value =
      line.slice(eqIndex + 1).trim();

    if (!key) return;

    if (
      key === 'paragraph' ||
      key === '段落'
    ) {
      data.paragraphs.push({
        id:
          'p_' +
          Date.now() +
          '_' +
          Math.random().toString(36).slice(2),
        text: value,
        annotations: []
      });
    }
    else {
      data[key] = value;
    }

  });

  if (!data.diaryId) {
    data.diaryId =
      'diary_' + Date.now();
  }

  if (!data.authorId) {
    console.warn(
      '[VV_DIARY_SYNC] 缺少 authorId',
      data
    );
    return null;
  }

  return data;
}

async function handleVVDiarySyncRaw(input) {

  const raw =
    typeof input === 'string'
      ? input
      : String(input && input.raw || '');

  const fallbackAuthorId =
    typeof input === 'object' && input
      ? String(input.authorId || '').trim()
      : '';

  console.log(
    '[VV_DIARY_SYNC_RAW]',
    raw
  );

  const blocks =
    parseVVDiarySyncBlocks(raw);

  console.log(
    '[VV_DIARY_SYNC_BLOCKS]',
    blocks
  );

  if (!blocks.length) {
    console.warn(
      '[VV_DIARY_SYNC] 没解析到日记块'
    );
    return false;
  }

  blocks.forEach(block => {

    if (!block.authorId && fallbackAuthorId) {
      block.authorId = fallbackAuthorId;
    }

    appendVVDiaryToLocal(block);
  });

  saveAll();

  if (
    typeof renderDiaryContent === 'function'
  ) {
    renderDiaryContent();
  }

  return true;
}

function appendVVDiaryToLocal(block) {

  if (!block) {
    console.warn('[VV_DIARY_ADD] empty block');
    return false;
  }

  if (!window.diaryData) {
    window.diaryData = {
      diaries: []
    };
  }

  if (!Array.isArray(diaryData.diaries)) {
    diaryData.diaries = [];
  }

  const diaryId =
    String(
      block.diaryId ||
      block.id ||
      ''
    ).trim();

  if (!diaryId) {
    console.warn('[VV_DIARY_ADD] missing diaryId:', block);
    return false;
  }

  const oldIndex =
    diaryData.diaries.findIndex(
      d => String(d.id || d.diaryId || '') === diaryId
    );

  const author =
    contactList.find(
      c => c.id === block.authorId
    );

  const safeParagraphs =
    typeof normalizeDiaryParagraphs === 'function'
      ? normalizeDiaryParagraphs(
          Array.isArray(block.paragraphs)
            ? block.paragraphs
            : (
                block.paragraph
                  ? [block.paragraph]
                  : []
              )
        )
      : (
          Array.isArray(block.paragraphs)
            ? block.paragraphs.map(function(p) {
                if (typeof p === 'string') return p;
                if (p && typeof p === 'object') {
                  return String(
                    p.text ||
                    p.content ||
                    p.value ||
                    p.paragraph ||
                    p.body ||
                    ''
                  );
                }
                return String(p || '');
              }).filter(Boolean)
            : []
        );

  const contentFromParagraphs =
    safeParagraphs.length
      ? safeParagraphs.join('\n\n')
      : '';

  const diary = {
    id:
      diaryId,

    diaryId:
      diaryId,

    authorId:
      String(block.authorId || '').trim(),

    authorName:
      block.authorName ||
      block.name ||
      author?.displayName ||
      author?.name ||
      author?.bridgeName ||
      'AI角色',

    title:
      block.title ||
      '未命名日记',

    date:
      block.date ||
      new Date().toLocaleDateString(),

    weather:
      block.weather ||
      '未知',

    content:
      block.content ||
      contentFromParagraphs ||
      '',

    paragraphs:
      safeParagraphs,

    annotations:
      Array.isArray(block.annotations)
        ? block.annotations
        : [],

    review:
      block.review || '',

    source:
      block.source || 'ai'
  };

  if (oldIndex >= 0) {
    diaryData.diaries[oldIndex] = {
      ...diaryData.diaries[oldIndex],
      ...diary
    };
  }
  else {
    diaryData.diaries.unshift(diary);
  }

  if (typeof saveAll === 'function') {
    saveAll();
  }

  console.log(
    '[VV_DIARY_ADDED]',
    diary
  );

  return true;
}

function parseVVChatBlocks(raw, fallback = {}) {
  let text = String(raw || '');

  console.log('[VV] parseVVChatBlocks input full >>>');
  console.log(text);
  console.log('<<< [VV] parseVVChatBlocks input full');

  if (!text.trim()) {
    console.warn('[VV] parseVVChatBlocks: empty raw');
    return null;
  }

  // 1. 如果是 HTML 包装，先尽量解成纯文本
  if (/[<>]/.test(text) && (text.includes('<div') || text.includes('<span') || text.includes('<br') || text.includes('<'))) {
    try {
      const div = document.createElement('div');
      div.innerHTML = text;
      const decoded = div.textContent || div.innerText || '';
      if (decoded && decoded.trim()) {
        console.log('[VV] parseVVChatBlocks html decoded text >>>');
        console.log(decoded);
        console.log('<<< [VV] parseVVChatBlocks html decoded text');
        text = decoded;
      }
    } catch (err) {
      console.warn('[VV] parseVVChatBlocks html decode failed:', err);
    }
  }

  text = text
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ')
    .trim();

  console.log('[VV] parseVVChatBlocks normalized text >>>');
  console.log(text);
  console.log('<<< [VV] parseVVChatBlocks normalized text');

  const syncMatch = text.match(/\[VV_CHAT_SYNC\]([\s\S]*?)\[\/VV_CHAT_SYNC\]/i);

  console.log('[VV] syncMatch exists:', !!syncMatch);

  const chatMatch = syncMatch;
  if (!chatMatch) {
    console.warn('[VV] parseVVChatBlocks: no VV_CHAT_SYNC block found');
    return null;
  }

  const full = String(chatMatch[1] || '').replace(/\r/g, '').trim();

  console.log('[VV] extracted block full >>>');
  console.log(full);
  console.log('<<< [VV] extracted block full');

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function readField(name) {
    const m = full.match(new RegExp('^\\s*' + escapeRegExp(name) + '\\s*[=:]\\s*(.*)$', 'mi'));
    const value = m ? m[1].trim() : '';
    console.log('[VV][parseVVChatBlocks][readField]', name, '=>', value);
    return value;
  }

  function cleanValue(v) {
    return String(v || '')
      .replace(/\r/g, '')
      .replace(/^\s+|\s+$/g, '');
  }

  const chat = {
    chatId: cleanValue(readField('chatId')) || cleanValue(fallback.chatId),
    target: cleanValue(readField('target')),
    time: cleanValue(readField('time')),
    myAvatarKey: cleanValue(readField('myAvatarKey')),
    targetAvatarId: cleanValue(readField('targetAvatarId')),
    myBubble: cleanValue(readField('myBubble')),
    targetBubble: cleanValue(readField('targetBubble')),
    chatBgKey: cleanValue(readField('chatBgKey')),
    messages: []
  };

  console.log('[VV][parseVVChatBlocks] fallback =', fallback);
  console.log('[VV][parseVVChatBlocks] top-level parsed chat meta =', {
    chatId: chat.chatId,
    target: chat.target,
    time: chat.time,
    myAvatarKey: chat.myAvatarKey,
    targetAvatarId: chat.targetAvatarId,
    myBubble: chat.myBubble,
    targetBubble: chat.targetBubble,
    chatBgKey: chat.chatBgKey
  });

  // ===== 消息块提取（支持有/无闭合标签 [/消息]） =====
  const msgSplitRegex = /\[消息\]/gi;
  let splitMatch;
  const splitPositions = [];

  while ((splitMatch = msgSplitRegex.exec(full))) {
    splitPositions.push(splitMatch.index + splitMatch[0].length);
  }

  console.log('[VV][parseVVChatBlocks] msgBlocks found:', splitPositions.length);

  let msgIndex = 0;

  for (let si = 0; si < splitPositions.length; si++) {
    const start = splitPositions[si];
    let end;

    if (si + 1 < splitPositions.length) {
      const nextTagSearch = full.substring(start).indexOf('[消息]');
      end = nextTagSearch !== -1 ? start + nextTagSearch : splitPositions[si + 1];
    } else {
      const closeMsgIdx = full.indexOf('[/消息]', start);
      end = closeMsgIdx !== -1 ? closeMsgIdx : full.length;
    }

    const block = full.substring(start, end).replace(/\[\/消息\]\s*$/i, '').trim();
    if (!block) continue;

    console.log('[VV] found msg block >>>');
    console.log(block);
    console.log('<<< [VV] found msg block');

    function readMsgField(name) {
      const mm = block.match(new RegExp('^\\s*' + escapeRegExp(name) + '\\s*[=:]\\s*(.*)$', 'mi'));
      const value = mm ? mm[1].trim() : '';
      console.log('[VV][parseVVChatBlocks][readMsgField][' + msgIndex + ']', name, '=>', value);
      return value;
    }

    const msg = {
      side: cleanValue(readMsgField('side')),
      sender: cleanValue(readMsgField('sender')),
      content: cleanValue(
        readMsgField('content') ||
        readMsgField('text') ||
        readMsgField('message') ||
        readMsgField('msg')
      ),
      state: cleanValue(readMsgField('state')) || 'reply',
      type: cleanValue(readMsgField('type')) || 'text',
      transferAction: cleanValue(readMsgField('transferAction')),
      transferAmount: cleanValue(readMsgField('transferAmount')),
      transferNote: cleanValue(readMsgField('transferNote')),
      _raw: block
    };

    console.log('[VV] parsed msg:', msg);
    chat.messages.push(msg);
    msgIndex++;
  }
  // ===== 消息块提取结束 =====

  chat.messages = chat.messages.filter(Boolean);

  console.log('[VV] parseVVChatBlocks parsed chat:', chat);
  console.log('[VV][parseVVChatBlocks][SUMMARY]', {
    chatId: chat.chatId,
    msgCount: chat.messages.length,
    leftCount: chat.messages.filter(msg => {
      const side = String(msg.side || '').trim().toLowerCase();
      return side === 'left' || side === 'assistant' || side === 'them';
    }).length,
    rightCount: chat.messages.filter(msg => {
      const side = String(msg.side || '').trim().toLowerCase();
      return side === 'right' || side === 'user' || side === 'me';
    }).length
  });

  return chat;
}

function normalizeFeedKeyText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/[，。！？、,.!?；;：:]/g, '')
    .trim();
}

function buildFeedCommentKey(item) {
  item = item || {};
  return [
    normalizeFeedKeyText(item.from || item.author || ''),
    normalizeFeedKeyText(item.text || item.content || ''),
    normalizeFeedKeyText(item.replyTo || '')
  ].join('|');
}

function buildFeedLikeKey(item) {
  item = item || {};
  return normalizeFeedKeyText(item.from || item.author || '');
}

function dedupeFeedComments(comments) {
  const seen = {};
  const result = [];

  (comments || []).forEach(function (c) {
    if (!c) return;

    const from = String(c.from || c.author || '').trim();
    const text = String(c.text || c.content || '').trim();
    const replyTo = String(c.replyTo || '').trim();

    if (!from || !text) return;

    const key = buildFeedCommentKey({
      from,
      text,
      replyTo
    });

    if (!key || key === '||') return;
    if (seen[key]) return;

    seen[key] = true;
    result.push({
      from,
      text,
      replyTo
    });
  });

  return result;
}

function dedupeFeedLikes(likes) {
  const seen = {};
  const result = [];

  (likes || []).forEach(function (l) {
    if (!l) return;

    const from = String(l.from || l.author || '').trim();
    if (!from) return;

    const key = buildFeedLikeKey({ from });
    if (!key) return;
    if (seen[key]) return;

    seen[key] = true;
    result.push({ from });
  });

  return result;
}

function readFeedField(block, key) {
  block = String(block || '');
  key = String(key || '');

  const re = new RegExp(
    '(?:^|\\n)\\s*' + key + '\\s*=\\s*([\\s\\S]*?)(?=\\n[a-zA-Z\\u4e00-\\u9fa5]+\\s*=|\\n\\[\\/|\\[\\/|$)',
    'i'
  );

  const m = block.match(re);
  return m ? String(m[1] || '').trim() : '';
}

function parseFeedSyncRaw(raw) {
  const result = {
    postId: '',
    time: '',
    interactions: [],
    post: null
  };

  if (!raw) return result;

  const syncMatch = String(raw).match(/\[VV_FEED_SYNC\]([\s\S]*?)\[\/VV_FEED_SYNC\]/i);
  if (!syncMatch) return result;

  const block = syncMatch[1];

  result.postId = readFeedField(block, 'postId');
  result.time = readFeedField(block, 'time');

  // =========================
  // 解析 AI 主动动态
  // =========================

  const postBlocks = block.match(/\[动态\][\s\S]*?\[\/动态\]/gi) || [];
  let latestPostBlock = '';

  // 取最后一个有 content 的 [动态]
  for (let i = postBlocks.length - 1; i >= 0; i--) {
    const innerMatch = postBlocks[i].match(/\[动态\]([\s\S]*?)\[\/动态\]/i);
    const inner = innerMatch ? innerMatch[1] : '';
    const content = readFeedField(inner, 'content');

    if (content) {
      latestPostBlock = postBlocks[i];
      break;
    }
  }

  if (latestPostBlock) {
    const pbMatch = latestPostBlock.match(/\[动态\]([\s\S]*?)\[\/动态\]/i);
    const pb = pbMatch ? pbMatch[1] : '';

    const from = readFeedField(pb, 'from');
    const bridgeName = readFeedField(pb, 'bridgeName');
    const content = readFeedField(pb, 'content');
    const photoText = readFeedField(pb, 'photo');

    result.post = {
      from,
      bridgeName,
      content,
      photos: []
    };

    if (photoText) {
      const imageMatches = [...photoText.matchAll(/\[图\d+:(.*?)\]/g)];

      result.post.photos = imageMatches.map(function (m) {
        return {
          simulated: true,
          desc: String(m[1] || '').trim()
        };
      });
    }
  }

  // =========================
  // 解析互动
  // =========================

  const interactionBlocks = block.match(/\[互动\]([\s\S]*?)\[\/互动\]/gi) || [];
  const seenInteractionKeys = {};

  interactionBlocks.forEach(function (ib) {
    const innerMatch = ib.match(/\[互动\]([\s\S]*?)\[\/互动\]/i);
    const inner = innerMatch ? innerMatch[1] : ib;

    const from = readFeedField(inner, 'from');
    const action = readFeedField(inner, 'action').toLowerCase();
    const content = readFeedField(inner, 'content');
    const replyTo = readFeedField(inner, 'replyTo');

    if (!from || !action) return;

    const item = {
      from,
      action
    };

    if (action === 'comment') {
      if (!content) return;
      item.content = content;
      item.text = content;
    }

    if (replyTo) {
      item.replyTo = replyTo;
    }

    let key = '';

    if (action === 'comment') {
      key = [
        normalizeFeedKeyText(from),
        normalizeFeedKeyText(content),
        normalizeFeedKeyText(replyTo)
      ].join('|');
    } else if (action === 'like') {
      key = 'like|' + normalizeFeedKeyText(from);
    } else {
      key = action + '|' + normalizeFeedKeyText(from) + '|' + normalizeFeedKeyText(content);
    }

    if (!key) return;
    if (seenInteractionKeys[key]) return;

    seenInteractionKeys[key] = true;
    result.interactions.push(item);
  });

  return result;
}

async function handleVVFeedSyncRaw(data) {
  const raw = String(data.raw || '');
  if (!raw.trim()) return;

  if (!/\[VV_FEED_SYNC\]/i.test(raw)) return;

  const parsed = parseFeedSyncRaw(raw);

  if (!parsed.postId) {
    console.warn('[VV][FEED] handleVVFeedSyncRaw: missing postId');
    return;
  }

  let post = feedPosts.find(p => p.id === parsed.postId);

  // =========================
  // AI主动动态：尝试匹配占位动态
  // =========================

  if (!post && parsed.post) {

    const pendingPost = feedPosts.find(p =>
      p.author === parsed.post.from &&
      (
        !p.content ||
        p.content === '正在发布中...' ||
        p.content.includes('正在发布')
      )
    );

    if (pendingPost) {
      post = pendingPost;
      post.id = parsed.postId;

      console.log('[VV][FEED] matched pending post:', parsed.postId);
    }
  }

  // =========================
  // 如果还是没找到
  // =========================

  if (!post) {
    console.warn('[VV][FEED] handleVVFeedSyncRaw: post not found, postId =', parsed.postId);
    return;
  }

  let changed = false;

  // =========================
  // AI主动动态：更新内容
  // =========================

  if (parsed.post) {

    post.content = parsed.post.content || post.content;

    if (parsed.post.photos?.length) {
      post.images = parsed.post.photos;
    }

    if (parsed.post.from) {
      post.author = parsed.post.from;
    }

    if (parsed.post.bridgeName) {
      post.bridgeName = parsed.post.bridgeName;
    }

    changed = true;

    console.log('[VV][FEED] AI post updated:', parsed.postId);
  }

  const myNames = new Set([
    '我',
    myProfile.nickname || '',
    appProfile.myName || ''
  ].filter(Boolean));

  parsed.interactions.forEach(function (item) {

    if (myNames.has(item.from)) return;

    if (item.action === 'like') {

      post.likes = post.likes || [];

      const already = post.likes.find(l => l.from === item.from);

      if (!already) {
        post.likes.push({ from: item.from });
        changed = true;
      }

    } else if (item.action === 'comment' && item.content) {

      post.comments = post.comments || [];

      post.comments.push({
        from: item.from,
        text: item.content,
        ...(item.replyTo ? { replyTo: item.replyTo } : {})
      });

      changed = true;
    }
  });

  // =========================
  // 最终刷新
  // =========================

  if (changed) {
    saveAll();
    renderFeedList();

    console.log(
      '[VV][FEED] feed sync applied:',
      parsed.postId
    );
  }
}

function handleAiFeedPost(payload) {
  if (!payload || !payload.from || !payload.content) {
    console.warn('[VVPHONE] invalid AI feed post payload');
    return;
  }

  var contact = contactList.find(function(c) {
    return c.bridgeName === payload.bridgeName || c.name === payload.from;
  });
  var authorId = contact ? contact.id : (payload.bridgeName || payload.from);

  var images = [];
  if (payload.photos && payload.photos.length > 0) {
    images = payload.photos.map(function(p) {
      return { simulated: true, desc: p.desc || p };
    });
  }

  var post = {
    id: payload.postId || ('f' + Date.now()),
    postId: payload.postId || ('f' + Date.now()),
    author: payload.from,
    authorId: authorId,
    bridgeName: payload.bridgeName || payload.from,
    time: payload.time || new Date().toLocaleString(),
    content: payload.content,
    images: images,
    likes: [],
    comments: []
  };

  feedPosts.unshift(post);
  saveAll();
  renderFeedList();

  console.log('[VVPHONE] AI feed post created:', post.postId, 'by', post.author);
}

function appendVVChatReplyToLocal(chatData, msgIndex) {
  try {
    if (!chatData || !chatData.chatId) {
      console.warn('[VV][APPEND] invalid chatData');
      return 0;
    }

    if (typeof window.pendingReplyTargets !== 'object' || !window.pendingReplyTargets) {
      window.pendingReplyTargets = {};
    }

    const chatId = chatData.chatId;

    if (!messages[chatId]) {
      messages[chatId] = [];
    }

    let contact = Array.isArray(contactList)
      ? contactList.find(i => i.id === chatId)
      : null;

    if (!contact && Array.isArray(contactList)) {
      contact = {
        id: chatId,
        name: chatData.target || '联系人',
        bridgeName: chatData.target || '',
        avatar: DEFAULT_AVATAR,
        isSticky: false,
        lastTime: getNowTime(),
        lastPreview: '',
        threadType: 'direct'
      };
      contactList.unshift(contact);
    } else if (contact) {
      if (chatData.target && (!contact.name || contact.name === '联系人')) {
        contact.name = chatData.target;
      }
      if (chatData.target && !contact.bridgeName) {
        contact.bridgeName = chatData.target;
      }
    }

    const setting = typeof normalizeChatSetting === 'function'
      ? (normalizeChatSetting(chatId) || {})
      : {};

    const rel = typeof getRelSetting === 'function'
      ? (getRelSetting(chatId) || {})
      : {};

    const thread = messages[chatId];
    const time = typeof getNowTime === 'function' ? getNowTime() : Date.now();
    const timeLabel = chatData.time || (typeof getNowFullLabel === 'function' ? getNowFullLabel() : '');
    const allMsgs = Array.isArray(chatData.messages) ? chatData.messages : [];

    const syncKey = (msgIndex >= 0) ? ('sync_' + chatId + '_' + msgIndex) : null;

    if (syncKey) {
      const existingBatchMsgs = thread.filter(m => m._syncKey === syncKey);
      if (existingBatchMsgs.length > 0) {
        console.log('[VV][APPEND] edit mode detected, syncKey=', syncKey, 'existing=', existingBatchMsgs.length);
        return handleSyncOverwrite(chatData, chatId, thread, syncKey, allMsgs, contact, time, timeLabel);
      }
    }

    const leftMsgs = allMsgs.filter(msg => {
      const side = String(msg.side || '').trim().toLowerCase();
      const hasTransferSignal =
        !!String(msg.transferAction || '').trim() ||
        !!String(msg.transferAmount || '').trim() ||
        !!String(msg.transferNote || '').trim();

      const content = String(msg.content || '').trim();

      return (side === 'left' || side === 'assistant' || side === 'them') &&
        (!!content || hasTransferSignal);
    });

    console.log('[VV][APPEND] rightMsgs skipped in append mode');

    console.log('[VV][APPEND] chatId =', chatId);
    console.log('[VV][APPEND] currentChatId =', currentChatId);
    console.log('[VV][APPEND] allMsgs =', allMsgs);
    console.log('[VV][APPEND] leftMsgs to append =', leftMsgs);
    console.log('[VV][APPEND] thread before append =', thread.slice());
    console.log('[VV][APPEND] pending before append =', pendingReplyTargets?.[chatId]);

    let appendedCount = 0;

    for (let i = 0; i < leftMsgs.length; i++) {
      const msg = leftMsgs[i];

      const normalizedContent = String(msg.content || '').trim();
      const normalizedType = String(msg.type || 'text').trim().toLowerCase() || 'text';
      const transferAction = String(msg.transferAction || '').trim().toLowerCase();
      const transferAmount = String(msg.transferAmount || '').trim();
      const transferNote = String(msg.transferNote || '').trim();

      console.log('[VV][APPEND] processing msg =', {
        index: i,
        msg,
        normalizedContent,
        normalizedType,
        transferAction,
        transferAmount,
        transferNote,
        timeLabel
      });

      const duplicated = thread.some(item => {
        const oldText = Array.isArray(item.chunks)
          ? item.chunks.join('\n').trim()
          : String(item.text || '').trim();

        const same = (
          !item.isMe &&
          !item.recalled &&
          String(item.type || 'text') === 'text' &&
          oldText === normalizedContent &&
          String(item.timeLabel || '') === String(timeLabel || '')
        );

        if (same) {
          console.log('[VV][APPEND] duplicate matched existing item =', item);
        }

        return same;
      });

      console.log('[VV][APPEND] duplicated =', duplicated);

      if (normalizedContent && !duplicated) {
        const newMsg = {
          id: 'm' + Date.now() + '_' + Math.random().toString(36).slice(2),
          sender: 'them',
          senderName: (contact && contact.name) ? contact.name : (msg.sender || chatData.target || '对方'),
          isMe: false,
          type: normalizedType || 'text',
          chunks: [normalizedContent],
          text: normalizedContent,
          replyTo: null,
          recalled: false,
          time,
          timeLabel,
          state: msg.state || 'reply'
        };

        if (syncKey) newMsg._syncKey = syncKey;

        console.log('[VV][APPEND] before push newMsg =', newMsg);
        thread.push(newMsg);
        console.log('[VV][APPEND] after push, thread =', thread.slice());
        appendedCount++;
      } else if (!normalizedContent && !transferAction) {
        console.log('[VV][APPEND] skipped empty content msg =', msg);
      } else if (duplicated) {
        console.log('[VV][APPEND] skipped duplicate msg =', msg);
      }

      if (transferAction === 'accept') {
        const transferMsg = typeof findLastPendingMyTransfer === 'function'
          ? findLastPendingMyTransfer(chatId)
          : null;
        console.log('[VV][APPEND] transferAction=accept transferMsg =', transferMsg);
        if (transferMsg && typeof acceptMyTransferByAI === 'function') {
          acceptMyTransferByAI(chatId, transferMsg);
        }
      }

      if (transferAction === 'return') {
        const transferMsg = typeof findLastPendingMyTransfer === 'function'
          ? findLastPendingMyTransfer(chatId)
          : null;
        console.log('[VV][APPEND] transferAction=return transferMsg =', transferMsg);
        if (transferMsg && typeof returnMyTransferByAI === 'function') {
          returnMyTransferByAI(chatId, transferMsg);
        }
      }

      if (transferAction === 'send') {
        const amount = Number(transferAmount || 0);
        const note = transferNote || '给你的转账';

        console.log('[VV][APPEND] transferAction=send amount/note =', amount, note);

        if (amount > 0) {
          const alreadyExists = thread.some(item => {
            const same = (
              !item.isMe &&
              item.type === 'transfer' &&
              Number(item.amount || 0) === amount &&
              String(item.note || '').trim() === note &&
              item.status === '待收款'
            );
            if (same) {
              console.log('[VV][APPEND] existing transfer matched item =', item);
            }
            return same;
          });

          console.log('[VV][APPEND] transfer alreadyExists =', alreadyExists);

          if (!alreadyExists && typeof receiveTransferFromAI === 'function') {
            receiveTransferFromAI(chatId, amount, note);
          }
        }
      }
    }

    if (chatData.target && rel && !rel.name) {
      rel.name = chatData.target;
    }

    if (chatData.myBubble) setting.myBubble = chatData.myBubble;
    if (chatData.targetBubble) setting.targetBubble = chatData.targetBubble;

    if (chatData.targetAvatarId && (
      String(chatData.targetAvatarId).startsWith('idb:') ||
      String(chatData.targetAvatarId).startsWith('http') ||
      String(chatData.targetAvatarId).startsWith('data:image/')
    )) {
      setting.theirAvatar = chatData.targetAvatarId;
      setting.targetAvatarId = chatData.targetAvatarId;
    }

    if (chatData.target) setting.target = chatData.target;

    if (leftMsgs.length > 0) {
      const lastTextMsg = [...leftMsgs].reverse().find(item => String(item.content || '').trim());
      const previewText = lastTextMsg
        ? lastTextMsg.content
        : (leftMsgs[leftMsgs.length - 1].transferAction ? '[转账消息]' : '[新消息]');

      console.log('[VV][APPEND] updateLastMsg previewText =', previewText);

      if (typeof updateLastMsg === 'function') {
        updateLastMsg(chatId, previewText, time, 'direct');
      } else {
        console.warn('[VV][APPEND] updateLastMsg not available');
      }
    }

    if (appendedCount > 0) {
      console.log('[VV][APPEND] clear pending flags because appendedCount > 0, chatId =', chatId);

      pendingReplyTargets[chatId] = false;

      thread.forEach(m => {
        if (m.isMe && !m.recalled && m.pendingForReply) {
          m.pendingForReply = false;
        }
      });
    } else {
      console.log('[VV][APPEND] no new left text appended, keep pending state, chatId =', chatId, 'pending =', pendingReplyTargets?.[chatId]);
    }

    if (typeof saveAll === 'function') {
      saveAll();
    } else {
      console.warn('[VV][APPEND] saveAll not available');
    }

    console.log('[VV][APPEND] appendedCount =', appendedCount);
    console.log('[VV][APPEND] final thread =', thread.slice());
    console.log('[VV][APPEND] pending after append =', pendingReplyTargets?.[chatId]);

    return appendedCount;
  } catch (err) {
    console.error('[VV][APPEND] fatal error:', err, chatData);
    return 0;
  }
}

function rebuildFeedPostsFromRaw(fullRaw) {
  if (!fullRaw) return;

  var blocks = String(fullRaw).match(
    /\[VV_FEED_HIDDEN_DATA\]([\s\S]*?)\[\/VV_FEED_HIDDEN_DATA\]/g
  ) || [];

  console.log('[VV][FEED] found hidden blocks:', blocks.length);
  if (blocks.length === 0) return;

  var changed = false;

  blocks.forEach(function (block) {
    try {
      // 提取 postId
      var postId = readFeedField(block, 'postId');
      if (!postId) return;

      // 提取所有 [动态] 块，取最后一个有 content 的
      var dynBlocks = block.match(/\[动态\]([\s\S]*?)\[\/动态\]/gi) || [];
      var latestDyn = null;

      for (var i = dynBlocks.length - 1; i >= 0; i--) {
        var dynInnerMatch = dynBlocks[i].match(/\[动态\]([\s\S]*?)\[\/动态\]/i);
        var dynInner = dynInnerMatch ? dynInnerMatch[1] : dynBlocks[i];
        var contentCheck = readFeedField(dynInner, 'content');

        if (contentCheck && contentCheck.trim()) {
          latestDyn = dynBlocks[i];
          break;
        }
      }

      if (!latestDyn) return;

      var latestInnerMatch = latestDyn.match(/\[动态\]([\s\S]*?)\[\/动态\]/i);
      var latestInner = latestInnerMatch ? latestInnerMatch[1] : latestDyn;

      var from = readFeedField(latestInner, 'from');
      var bridgeName = readFeedField(latestInner, 'bridgeName');
      var time = readFeedField(latestInner, 'time');
      var content = readFeedField(latestInner, 'content');
      var photoText = readFeedField(latestInner, 'photo');

      // 提取模拟图片
      var photos = [];
      if (photoText) {
        var imgMatches = [...photoText.matchAll(/\[图\d+:(.*?)\]/g)];
        photos = imgMatches.map(function (m) {
          return {
            simulated: true,
            desc: String(m[1] || '').trim()
          };
        });
      }

      // 提取互动，并在 raw 层先去重
      var interactionBlocks = block.match(/\[互动\]([\s\S]*?)\[\/互动\]/gi) || [];
      var interactions = [];
      var seenInteractionKeys = {};

      interactionBlocks.forEach(function (ib) {
        var innerMatch = ib.match(/\[互动\]([\s\S]*?)\[\/互动\]/i);
        var inner = innerMatch ? innerMatch[1] : ib;

        var ifrom = readFeedField(inner, 'from');
        var iaction = readFeedField(inner, 'action').toLowerCase();
        var icontent = readFeedField(inner, 'content');
        var ireplyTo = readFeedField(inner, 'replyTo');

        if (!ifrom || !iaction) return;

        var item = {
          from: ifrom,
          action: iaction
        };

        var key = '';

        if (iaction === 'comment') {
          if (!icontent) return;

          item.text = icontent;
          item.content = icontent;

          if (ireplyTo) {
            item.replyTo = ireplyTo;
          }

          key = [
            'comment',
            normalizeFeedKeyText(ifrom),
            normalizeFeedKeyText(icontent),
            normalizeFeedKeyText(ireplyTo)
          ].join('|');
        } else if (iaction === 'like') {
          key = [
            'like',
            normalizeFeedKeyText(ifrom)
          ].join('|');
        } else {
          key = [
            iaction,
            normalizeFeedKeyText(ifrom),
            normalizeFeedKeyText(icontent),
            normalizeFeedKeyText(ireplyTo)
          ].join('|');
        }

        if (!key) return;
        if (seenInteractionKeys[key]) return;

        seenInteractionKeys[key] = true;
        interactions.push(item);
      });

      // 找现有动态，按 id 或 postId
      var existing = feedPosts.find(function (p) {
        return String(p.id || '') === postId || String(p.postId || '') === postId;
      });

      if (existing) {
        // 更新动态主体
        if (content) existing.content = content;
        if (time) existing.time = time;
        if (bridgeName) existing.bridgeName = bridgeName;
        if (from) existing.author = from;

        if (photos.length) {
          existing.images = photos;
        }

        existing.id = postId;
        existing.postId = postId;

        existing.comments = Array.isArray(existing.comments) ? existing.comments : [];
        existing.likes = Array.isArray(existing.likes) ? existing.likes : [];

        // 先把已有的也去一次重，清理旧污染
        existing.comments = dedupeFeedComments(existing.comments);
        existing.likes = dedupeFeedLikes(existing.likes);

        interactions.forEach(function (item) {
          if (item.action === 'like') {
            var likeKey = buildFeedLikeKey(item);

            var hasLike = existing.likes.some(function (l) {
              return buildFeedLikeKey(l) === likeKey;
            });

            if (!hasLike) {
              existing.likes.push({
                from: item.from
              });
              changed = true;
            }
          } else if (item.action === 'comment' && item.text) {
            var commentItem = {
              from: item.from,
              text: item.text,
              replyTo: item.replyTo || ''
            };

            var commentKey = buildFeedCommentKey(commentItem);

            var hasComment = existing.comments.some(function (c) {
              return buildFeedCommentKey(c) === commentKey;
            });

            if (!hasComment) {
              existing.comments.push(commentItem);
              changed = true;
            }
          }
        });

        // 合并后再去重一次
        var beforeCommentLen = existing.comments.length;
        var beforeLikeLen = existing.likes.length;

        existing.comments = dedupeFeedComments(existing.comments);
        existing.likes = dedupeFeedLikes(existing.likes);

        if (existing.comments.length !== beforeCommentLen || existing.likes.length !== beforeLikeLen) {
          changed = true;
        }

        // 主体字段更新也算 changed
        changed = true;
      } else {
        var newComments = interactions
          .filter(function (i) {
            return i.action === 'comment' && i.text;
          })
          .map(function (i) {
            return {
              from: i.from,
              text: i.text,
              replyTo: i.replyTo || ''
            };
          });

        var newLikes = interactions
          .filter(function (i) {
            return i.action === 'like';
          })
          .map(function (i) {
            return {
              from: i.from
            };
          });

        feedPosts.unshift({
          id: postId,
          postId: postId,
          author: from,
          bridgeName: bridgeName,
          time: time,
          content: content,
          images: photos,
          comments: dedupeFeedComments(newComments),
          likes: dedupeFeedLikes(newLikes)
        });

        changed = true;
      }
    } catch (err) {
      console.warn('[VV][FEED] parse block failed:', err);
    }
  });

  // 最后一层保险：所有动态全局清理重复评论/点赞
  if (Array.isArray(feedPosts)) {
    feedPosts.forEach(function (post) {
      if (!post) return;

      post.comments = dedupeFeedComments(post.comments || []);
      post.likes = dedupeFeedLikes(post.likes || []);
    });
  }

  if (changed) {
    saveAll();
    renderFeedList();
    console.log('[VV][FEED] rebuild done:', feedPosts.length, 'posts');
  }
}

function handleSyncOverwrite(chatData, chatId, thread, syncKey, allMsgs, contact, time, timeLabel) {
  // 找到这个批次的所有消息在 thread 里的起始位置
  var batchStartIdx = -1;
  for (var i = 0; i < thread.length; i++) {
    if (thread[i]._syncKey === syncKey) {
      batchStartIdx = i;
      break;
    }
  }

  if (batchStartIdx < 0) return 0;

  // 移除旧批次消息
  var oldBatchCount = 0;
  while (batchStartIdx + oldBatchCount < thread.length && thread[batchStartIdx + oldBatchCount]._syncKey === syncKey) {
    oldBatchCount++;
  }

  thread.splice(batchStartIdx, oldBatchCount);
  console.log('[VV][OVERWRITE] removed', oldBatchCount, 'old msgs at index', batchStartIdx);

  // 按新 allMsgs 顺序插入
  var insertCount = 0;
  for (var j = 0; j < allMsgs.length; j++) {
    var msg = allMsgs[j];
    var side = String(msg.side || '').trim().toLowerCase();
    var content = String(msg.content || '').trim();
    var transferAction = String(msg.transferAction || '').trim().toLowerCase();

    if (!content && !transferAction) continue;

    var isMe = (side === 'right' || side === 'user' || side === 'me');

    var newMsg = {
      id: 'm' + Date.now() + '_ow_' + j,
      sender: isMe ? 'me' : 'them',
      senderName: isMe ? (msg.sender || '我') : ((contact && contact.name) ? contact.name : (msg.sender || chatData.target || '对方')),
      isMe: isMe,
      type: String(msg.type || 'text').trim().toLowerCase() || 'text',
      chunks: [content],
      text: content,
      replyTo: null,
      recalled: false,
      time: time,
      timeLabel: timeLabel,
      state: msg.state || (isMe ? 'sent' : 'reply'),
      _syncKey: syncKey
    };

    thread.splice(batchStartIdx + insertCount, 0, newMsg);
    insertCount++;
  }

  console.log('[VV][OVERWRITE] inserted', insertCount, 'new msgs at index', batchStartIdx);

  if (typeof saveAll === 'function') saveAll();
  return insertCount;
}

async function handleVVChatSyncRaw(payload) {
  console.log('[VV] handleVVChatSyncRaw called:', payload);
  const payloadMsgIndex = typeof payload === 'object' ? (payload?.msgIndex ?? -1) : -1;

  const raw = typeof payload === 'string' ? payload : (payload?.raw || '');
  const payloadChatId = typeof payload === 'object' ? (payload?.chatId || '') : '';
  const payloadViewId = typeof payload === 'object' ? (payload?.viewId || '') : '';

  if (/\[VV_ANNOTATION_SYNC\]/i.test(raw)) {
    console.log(
      '[VV][ANNOTATION] sync detected'
    );

    const parsed =
      parseVVAnnotationBlocks(raw);

    if (parsed) {
      appendVVAnnotationReplyToLocal(
        parsed
      );
      return true;
    }
  }

  // ========== 新增：如果只有电话同步没有聊天同步，直接转给电话处理 ==========
  if (/\[VV_CALL_SYNC\]/i.test(raw) && !/\[VV_CHAT_SYNC\]/i.test(raw)) {
    console.log('[VV] handleVVChatSyncRaw: only VV_CALL_SYNC found, redirecting to handleVVCallSyncRaw');
    await handleVVCallSyncRaw({ raw, chatId: payloadChatId });
    return true;
  }
  // ========== 新增结束 ==========

  console.log('[VV][HANDLE_SYNC][INPUT]', {
    payload,
    rawType: typeof raw,
    rawLength: String(raw || '').length,
    payloadChatId,
    payloadViewId,
    currentChatId,
    currentChatType
  });

  console.log('[VV][SYNC][RAW_TEXT_BEGIN]');
  console.log(raw);
  console.log('[VV][SYNC][RAW_TEXT_END]');

  const parsed = parseVVChatBlocks(raw, {
    chatId: payloadChatId || currentChatId,
    viewId: payloadViewId
  });

  console.log('[VV] parsed sync data:', parsed);
  console.log('[VV][PARSE_CHECK] raw preview =', String(raw || '').slice(0, 1000));
  console.log('[VV][PARSE_CHECK] parsed.chatId =', parsed?.chatId);
  console.log('[VV][PARSE_CHECK] parsed.target =', parsed?.target);
  console.log('[VV][PARSE_CHECK] parsed.time =', parsed?.time);
  console.log('[VV][PARSE_CHECK] parsed.messages =', parsed?.messages);
  console.log(
    '[VV][PARSE_CHECK] parsed.messages.length =',
    Array.isArray(parsed?.messages) ? parsed.messages.length : 'not-array'
  );

  if (!parsed || !parsed.chatId) {
    console.warn('[VV] handleVVChatSyncRaw: invalid parsed, request resend');
    requestResendLastVVChatSync(payloadChatId || currentChatId, payloadViewId);
    return false;
  }

  let incomingChatId = String(parsed.chatId || '').trim();
  const incomingName = String(parsed.target || '').trim();

  // ★ 优先信任 host 传来的 chatId
  if (payloadChatId && payloadChatId !== incomingChatId) {
    console.log('[VV][SYNC_FLOW] override AI chatId with host payload:', incomingChatId, '->', payloadChatId);
    incomingChatId = payloadChatId;
  }

  // ★ 用 _rpChatIdMap 精确覆盖：AI 输出的 target 可能是 bridgeName 而非备注名
  if (window._rpChatIdMap && incomingName) {
    var rpCorrectChatId = null;
    Object.keys(window._rpChatIdMap).forEach(function(name) {
      if (name === incomingName || name.includes(incomingName) || incomingName.includes(name)) {
        rpCorrectChatId = window._rpChatIdMap[name];
      }
    });
    if (rpCorrectChatId && rpCorrectChatId !== incomingChatId) {
      console.log('[VV][SYNC_FLOW] _rpChatIdMap remap:', incomingChatId, '->', rpCorrectChatId, '(target:', incomingName, ')');
      incomingChatId = rpCorrectChatId;
    }
  }

  // ★ 兜底：按名字 remap
  if (incomingName && Array.isArray(contactList)) {
    var existingById = contactList.find(function(c) {
      return String(c.id || '') === incomingChatId;
    });
    if (!existingById) {
      var existingByName = findContactByName(incomingName);
      if (existingByName) {
        console.log('[VV][SYNC_FLOW] RP chatId remap:', incomingChatId, '->', existingByName.id, '(matched by name:', incomingName, ')');
        incomingChatId = existingByName.id;
      }
    }
  }

  // 记录剧情时间
  if (parsed.time) {
    updateStoryTime(incomingChatId, parsed.time);
  }
  parsed.chatId = incomingChatId;

  const area = document.getElementById('messageArea');
  const uiNotReady = !vvAppReady || !area;

  console.log('[VV][SYNC_FLOW] vvAppReady =', vvAppReady);
  console.log('[VV][SYNC_FLOW] messageArea exists =', !!area);
  console.log('[VV][SYNC_FLOW] uiNotReady =', uiNotReady);

  if (uiNotReady) {
    console.warn('[VV] UI not ready, queue sync:', incomingChatId);
    pendingVVChatSyncQueue.push({
      raw,
      chatId: incomingChatId,
      viewId: payloadViewId,
      time: Date.now()
    });
    console.log('[VV][SYNC_FLOW] pendingVVChatSyncQueue =', pendingVVChatSyncQueue.slice());
    return false;
  }

  if (!messages || typeof messages !== 'object') {
    console.warn('[VV][SYNC_FLOW] messages store invalid');
    return false;
  }

  if (!Array.isArray(messages[incomingChatId])) {
    messages[incomingChatId] = [];
    console.log('[VV][SYNC_FLOW] created messages thread for chatId =', incomingChatId);
  }

  if (Array.isArray(contactList)) {
    let contact = contactList.find(i => String(i?.id || '') === incomingChatId);

    const incomingAvatar =
      String(parsed?.targetAvatarId || parsed?.avatar || parsed?.targetAvatar || '').trim();

    if (!contact) {
      contact = {
        id: incomingChatId,
        name: incomingName || '联系人',
        bridgeName: incomingName || '',
        avatar: incomingAvatar || DEFAULT_AVATAR,
        avatarId: incomingAvatar || DEFAULT_AVATAR,
        isSticky: false,
        lastTime: parsed?.time || getNowTime(),
        lastPreview: '',
        threadType: 'direct'
      };

      contactList.unshift(contact);
      console.log('[VV][SYNC_FLOW] created contact item =', contact);
    } else {
      if (incomingName && (!contact.name || contact.name === '联系人')) {
        contact.name = incomingName;
      }

      if (incomingName && !contact.bridgeName) {
        contact.bridgeName = incomingName;
      }

      // 头像保护：只有旧头像为空/默认时，才允许同步头像补全
      if (incomingAvatar) {
        const oldAvatar = contact.avatar || contact.avatarId || '';

        if (isDefaultOrEmptyAvatarRef(oldAvatar)) {
          contact.avatar = incomingAvatar;
          contact.avatarId = incomingAvatar;
          console.log('[VV][AVATAR] filled empty/default target avatar from sync:', incomingAvatar);
        } else {
          console.log('[VV][AVATAR] keep existing custom target avatar:', oldAvatar);
        }
      }

      // 如果 avatar 和 avatarId 只有一个有值，补齐另一个，但不覆盖
      if (contact.avatar && !contact.avatarId) {
        contact.avatarId = contact.avatar;
      }

      if (contact.avatarId && !contact.avatar) {
        contact.avatar = contact.avatarId;
      }

      console.log('[VV][SYNC_FLOW] updated contact item =', contact);
    }
  } else {
    console.warn('[VV][SYNC_FLOW] contactList not available');
  }

  const beforeThread = Array.isArray(messages[incomingChatId])
    ? messages[incomingChatId].slice()
    : [];
  const beforeLeftCount = beforeThread.filter(m => !m.isMe && !m.recalled).length;

  console.log('[VV][SYNC_FLOW] thread before append =', beforeThread);
  console.log('[VV][SYNC_FLOW] beforeLeftCount =', beforeLeftCount);
  console.log('[VV][SYNC_FLOW] currentChatId before append =', currentChatId);

  const appended = appendVVChatReplyToLocal(parsed, payloadMsgIndex);

  const afterThread = Array.isArray(messages[incomingChatId])
    ? messages[incomingChatId].slice()
    : [];
  const afterLeftCount = afterThread.filter(m => !m.isMe && !m.recalled).length;

  console.log('[VV][SYNC_FLOW] appended =', appended);
  console.log('[VV][SYNC_FLOW] incomingChatId =', incomingChatId);
  console.log('[VV][SYNC_FLOW] currentChatId after append =', currentChatId);
  console.log('[VV][SYNC_FLOW] thread after append =', afterThread);
  console.log('[VV][SYNC_FLOW] afterLeftCount =', afterLeftCount);
  console.log('[VV][SYNC_FLOW] leftCountDelta =', afterLeftCount - beforeLeftCount);

  if (typeof renderChatList === 'function') {
    console.log('[VV][SYNC_FLOW] renderChatList()');
    renderChatList();
  } else if (typeof renderAllPanels === 'function') {
    console.log('[VV][SYNC_FLOW] renderAllPanels()');
    renderAllPanels();
  }

  const rerender = async (tag = '') => {
    const shouldRender =
      incomingChatId === currentChatId &&
      typeof renderMessages === 'function';

    console.log('[VV][SYNC_FLOW] rerender tag =', tag, {
      shouldRender,
      incomingChatId,
      currentChatId
    });

    if (shouldRender) {
      try {
        await renderMessages();
        console.log('[VV][SYNC_FLOW] renderMessages done, tag =', tag);
      } catch (err) {
        console.error('[VV][SYNC_FLOW] renderMessages error:', err);
      }
    }
  };

  await rerender('immediate');
  setTimeout(() => rerender('t+50'), 50);
  setTimeout(() => rerender('t+120'), 120);
  setTimeout(() => rerender('t+260'), 260);

  saveAll();

  console.log('[VV] handleVVChatSyncRaw done:', {
    chatId: incomingChatId,
    appended,
    beforeLeftCount,
    afterLeftCount
  });
  // 检测AI输出中是否有来电触发
  try {
    checkForIncomingCallTrigger(raw);
  } catch (err) {
    console.error('[VV_CALL] checkForIncomingCallTrigger error:', err);
  }

  return appended > 0;
}

async function flushPendingVVChatSyncQueue() {
  if (!pendingVVChatSyncQueue.length) return;

  const area = document.getElementById('messageArea');
  if (!vvAppReady || !area) {
    console.log('[VV] flush skipped: app not ready');
    return;
  }

  const now = Date.now();

  // 可选：顺手清理太旧的队列，避免堆积脏数据
  pendingVVChatSyncQueue = pendingVVChatSyncQueue.filter(item => {
    return item && item.raw && (now - (item.time || now) < 60 * 1000);
  });

  if (!pendingVVChatSyncQueue.length) return;

  const queue = pendingVVChatSyncQueue.slice();
  pendingVVChatSyncQueue = [];

  console.log('[VV] flushing queued sync count =', queue.length);

  for (const item of queue) {
    try {
      await handleVVChatSyncRaw({
        raw: item.raw || '',
        chatId: item.chatId || '',
        viewId: item.viewId || ''
      });
    } catch (e) {
      console.error('[VV] flush queued sync error:', e, item);
    }
  }

  saveAll();
}

async function triggerSlash(cmd, options = {}) {
  if (!cmd) return false;

  if (VV_BRIDGE_CONFIG.debug) {
    console.log('[VV] 触发指令:', cmd, 'options=', options);
  }

  try {
    const result = await new Promise((resolve) => {
      const requestId = 'vv-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      const viewId = window.__vv_view_id || '';

      let done = false;
      let timer = null;

      function cleanup() {
        if (done) return;
        done = true;

        window.removeEventListener('message', onMessage);

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }

      function onMessage(event) {
        const data = event.data;

        if (!data || typeof data !== 'object') return;
        if (data.type !== 'VV_EXECUTE_RESULT') return;
        if (data.requestId !== requestId) return;

        if (data.viewId && viewId && data.viewId !== viewId) {
          console.log('[VV] ignore VV_EXECUTE_RESULT for other viewId:', data.viewId, 'mine=', viewId);
          return;
        }

        cleanup();

        if (VV_BRIDGE_CONFIG.debug) {
          console.log('[VV] 收到 bridge 消息:', data);
        }

        resolve({
          ok: !!data.ok,
          error: data.error || null
        });
      }

      window.addEventListener('message', onMessage);

      const payload = {
        type: 'VV_EXECUTE_SLASH',
        requestId,
        viewId,
        command: cmd,

        // 动态
        feedMode: !!options.feedMode,
        feedMeta: options.feedMeta || null,
        userInteraction: options.userInteraction || null,

        // 注释/标注
        annotationMode: !!options.annotationMode,

        // 电话
        callMode: !!options.callMode,
        callPhase: options.callPhase || '',
        chatId: options.chatId || '',
        targetName: options.targetName || ''
      };

      window.parent.postMessage(payload, '*');

      console.log('[VV] posted VV_EXECUTE_SLASH', {
        requestId,
        viewId,
        feedMode: payload.feedMode,
        annotationMode: payload.annotationMode,
        callMode: payload.callMode,
        callPhase: payload.callPhase,
        chatId: payload.chatId,
        targetName: payload.targetName
      });

      timer = setTimeout(() => {
        cleanup();

        resolve({
          ok: false,
          error: 'timeout'
        });
      }, 15000);
    });

    if (!result.ok) {
      console.warn('[VV] slash 执行失败:', result.error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[VV] slash 执行异常:', err);
    return false;
  }
}

function escapeHTML(str) {
  const c1 = String.fromCharCode(38);
  const c2 = String.fromCharCode(60);
  const c3 = String.fromCharCode(62);
  const c4 = String.fromCharCode(34);
  const c5 = String.fromCharCode(39);

  const r1 = String.fromCharCode(38, 97, 109, 112, 59);
  const r2 = String.fromCharCode(38, 108, 116, 59);
  const r3 = String.fromCharCode(38, 103, 116, 59);
  const r4 = String.fromCharCode(38, 113, 117, 111, 116, 59);
  const r5 = String.fromCharCode(38, 35, 51, 57, 59);

  return String(str == null ? '' : str)
    .split(c1).join(r1)
    .split(c2).join(r2)
    .split(c3).join(r3)
    .split(c4).join(r4)
    .split(c5).join(r5);
}

function escapeHTMLAttr(str) {
  const c1 = String.fromCharCode(38);
  const c2 = String.fromCharCode(60);
  const c3 = String.fromCharCode(62);
  const c4 = String.fromCharCode(34);
  const c5 = String.fromCharCode(39);

  const r1 = String.fromCharCode(38, 97, 109, 112, 59);
  const r2 = String.fromCharCode(38, 108, 116, 59);
  const r3 = String.fromCharCode(38, 103, 116, 59);
  const r4 = String.fromCharCode(38, 113, 117, 111, 116, 59);
  const r5 = String.fromCharCode(38, 35, 51, 57, 59);

  return String(str == null ? '' : str)
    .split(c1).join(r1)
    .split(c2).join(r2)
    .split(c3).join(r3)
    .split(c4).join(r4)
    .split(c5).join(r5);
}

const escapeHtml = escapeHTML;
var escapeAttr = escapeHTMLAttr;

function openUserDiaryPage() {
  closeDialog('diaryChoiceDialog');
  openDiaryPage('me');
}

function ensureProfileData() {
  if (!myProfile || typeof myProfile !== 'object') {
    myProfile = {
      avatar: '',
      nickname: '我',
      avatarUnified: false,
      backgroundUnified: false,
      globalChatBg: ''
    };
  }

  if (!walletData || typeof walletData !== 'object') {
    walletData = { balance: 0 };
  }

  if (typeof myProfile.avatarUnified !== 'boolean') {
    myProfile.avatarUnified = false;
  }

  if (typeof myProfile.backgroundUnified !== 'boolean') {
    myProfile.backgroundUnified = false;
  }

  if (typeof myProfile.nickname !== 'string' || !myProfile.nickname.trim()) {
    myProfile.nickname = '我';
  }

  if (typeof walletData.balance !== 'number') {
    walletData.balance = Number(walletData.balance || 0);
  }
}

function getMyProfileAvatar() {
  ensureProfileData();
  return myProfile.avatar || DEFAULT_AVATAR;
}

function getMyAvatar(chatId = null) {
  ensureProfileData();

  if (!chatId) {
    return myProfile.avatar || DEFAULT_AVATAR;
  }

  const setting = normalizeChatSetting(chatId);

  if (myProfile.avatarUnified) {
    return setting.myAvatarOverride
      || myProfile.avatar
      || DEFAULT_AVATAR;
  }

  return setting.myAvatarBase
    || myProfile.avatar
    || DEFAULT_AVATAR;
}

function getChatBackground(chatId = null) {
  ensureProfileData();

  if (!chatId) {
    return myProfile.globalChatBg || '';
  }

  const setting = normalizeChatSetting(chatId);

  if (myProfile.backgroundUnified) {
    return setting.backgroundOverride
      || myProfile.globalChatBg
      || '';
  }

  return setting.backgroundBase
    || setting.background
    || myProfile.globalChatBg
    || '';
}

async function updateProfileUI() {
  ensureProfileData();

  const avatarUrl = await resolveImageRefToUrl(getMyProfileAvatar());

  const avatarEls = document.querySelectorAll('[data-my-profile-avatar]');
  avatarEls.forEach(el => {
    if (el.tagName === 'IMG') {
      el.src = avatarUrl;
    } else {
      el.style.backgroundImage = `url("${avatarUrl}")`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    }
  });

  const nicknameEl = document.getElementById('profileNickname');
  if (nicknameEl) nicknameEl.textContent = myProfile.nickname || '我';

  const avatarUnifiedInput = document.getElementById('avatarUnifiedSwitch');
  if (avatarUnifiedInput) avatarUnifiedInput.checked = !!myProfile.avatarUnified;

  const bgUnifiedInput = document.getElementById('backgroundUnifiedSwitch');
  if (bgUnifiedInput) bgUnifiedInput.checked = !!myProfile.backgroundUnified;

  const walletBalanceEl = document.getElementById('walletBalance');
  if (walletBalanceEl) walletBalanceEl.textContent = `¥${Number(walletData.balance || 0)}`;

  renderFeedHeader?.();
  renderFeedList?.();
  renderMessages?.();

  if (currentChatId) {
    renderMessages?.();
  }
}

async function setMyProfileAvatar(src) {
  ensureProfileData();
  myProfile.avatar = src || '';

  if (myProfile.avatarUnified) {
    Object.keys(chatSettings).forEach(chatId => {
      const setting = getChatSetting(chatId);
      setting.myAvatarOverride = '';
    });
  }

  saveAll();

  await updateProfileUI();
  renderMessages?.();
  renderChatList?.();
  renderFeedHeader?.();
  renderFeedList?.();
  renderGroupList?.();
}

function setMyProfileNickname(name) {
  ensureProfileData();
  myProfile.nickname = (name || '').trim() || '我';
  updateProfileUI();
  saveAll();
}

function addWalletBalance(amount) {
  ensureProfileData();
  walletData.balance = Number(walletData.balance || 0) + Number(amount || 0);
  if (walletData.balance < 0) walletData.balance = 0;
  updateProfileUI();
  saveAll();
}

function getWalletBalance() {
  ensureProfileData();
  return Number(walletData.balance || 0);
}

function canAfford(amount) {
  return getWalletBalance() >= Number(amount || 0);
}

function subtractWalletBalance(amount) {
  ensureProfileData();
  const value = Number(amount || 0);

  if (value <= 0) return false;
  if (getWalletBalance() < value) return false;

  walletData.balance = Number(walletData.balance || 0) - value;
  if (walletData.balance < 0) walletData.balance = 0;

  updateProfileUI();
  saveAll();
  return true;
}

async function toggleAvatarUnified(checked) {
  ensureProfileData();
  myProfile.avatarUnified = !!checked;

  if (checked) {
    Object.keys(chatSettings).forEach(chatId => {
      const setting = getChatSetting(chatId);
      setting.myAvatarOverride = '';
    });
  }

  saveAll();

  await updateProfileUI();
  renderMessages?.();
  renderChatList?.();
  renderFeedHeader?.();
  renderFeedList?.();
  renderGroupList?.();
}

async function toggleBackgroundUnified(checked) {
  ensureProfileData();
  myProfile.backgroundUnified = !!checked;

  if (checked) {
    Object.keys(chatSettings).forEach(chatId => {
      const setting = getChatSetting(chatId);
      setting.backgroundOverride = '';
    });
  }

  saveAll();

  await updateProfileUI?.();
  await applyCurrentChatBackground?.();
  renderChatList?.();
  renderFeedHeader?.();
  renderFeedList?.();
  renderGroupList?.();
}

function handleWalletClick() {
  playClickSound?.();
  addWalletBalance(10);
}

function handleProfileNicknameChange() {
  const input = document.getElementById('profileNicknameInput');
  if (!input) return;
  setMyProfileNickname(input.value);
}

function triggerGlobalBgPick() {
  document.getElementById('globalBgInput')?.click();
}

function initProfilePage() {
  ensureProfileData();

  const avatarInput = document.getElementById('profileAvatarInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', e => {
      const file = e.target.files?.[0];
      handleProfileAvatarFile(file);
      e.target.value = '';
    });
  }

  const bgInput = document.getElementById('globalBgInput');
  if (bgInput) {
    bgInput.addEventListener('change', e => {
      const file = e.target.files?.[0];
      handleGlobalBgFile(file);
      e.target.value = '';
    });
  }

  updateProfileUI();
}

// ===== 时间系统 =====

// 时间模式存储：每个 chatId 独立
// timeSettings[chatId] = {
//   mode: 'story' | 'manual' | 'real',   // 默认 'story'
//   storyTime: '5月10日 22:30',           // AI 最后回复的剧情时间
//   manualTime: '2026-05-10T22:30',       // 手动设置的时间（ISO格式）
//   storyBaseReal: 1234567890000           // 记录收到剧情时间时的真实时间戳
// }

if (typeof window.timeSettings !== 'object' || !window.timeSettings) {
  window.timeSettings = {};
  // 尝试从 localStorage 恢复
  try {
    const saved = localStorage.getItem('vv_timeSettings');
    if (saved) window.timeSettings = JSON.parse(saved);
  } catch(e) {}
}

function saveTimeSettings() {
  try {
    localStorage.setItem('vv_timeSettings', JSON.stringify(window.timeSettings));
  } catch(e) {}
}

function getTimeSetting(chatId) {
  if (!chatId) return { mode: 'real' };
  if (!window.timeSettings[chatId]) {
    window.timeSettings[chatId] = { mode: 'story' };
  }
  return window.timeSettings[chatId];
}

function setTimeMode(chatId, mode) {
  if (!chatId) return;
  const ts = getTimeSetting(chatId);
  ts.mode = mode;
  saveTimeSettings();
  console.log('[VV][TIME] setTimeMode:', chatId, mode);
}

// AI 回复时调用：记录剧情时间
function updateStoryTime(chatId, timeStr) {
  if (!chatId || !timeStr) return;
  const ts = getTimeSetting(chatId);
  ts.storyTime = String(timeStr).trim();
  ts.storyBaseReal = Date.now();
  saveTimeSettings();
  console.log('[VV][TIME] updateStoryTime:', chatId, timeStr);
}

// 手动设置时调用
function setManualTime(chatId, isoString) {
  if (!chatId) return;
  const ts = getTimeSetting(chatId);
  ts.manualTime = isoString;
  saveTimeSettings();
  console.log('[VV][TIME] setManualTime:', chatId, isoString);
}

// 解析中文时间标签为 Date 对象（尽力解析）
function parseChineseTimeLabel(label) {
  if (!label) return null;
  const str = String(label).trim();

  // 匹配 "X月X日 HH:MM"
  const m = str.match(/(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = parseInt(m[1], 10) - 1;
  const day = parseInt(m[2], 10);
  const hour = parseInt(m[3], 10);
  const minute = parseInt(m[4], 10);

  const d = new Date(year, month, day, hour, minute, 0, 0);
  return isNaN(d.getTime()) ? null : d;
}

// 根据剧情时间 + 经过的真实时间差，计算当前剧情时间
function getStoryDate(chatId) {
  const ts = getTimeSetting(chatId);
  if (!ts.storyTime) return null;

  const base = parseChineseTimeLabel(ts.storyTime);
  if (!base) return null;

  // 如果有基准真实时间，加上经过的时间差
  if (ts.storyBaseReal) {
    const elapsed = Date.now() - ts.storyBaseReal;
    return new Date(base.getTime() + elapsed);
  }

  return base;
}

// 核心：获取当前聊天的时间（替代原来的 new Date()）
function getChatNow(chatId) {
  const cid = chatId || (typeof currentChatId !== 'undefined' ? currentChatId : '');
  const ts = getTimeSetting(cid);

  if (ts.mode === 'manual' && ts.manualTime) {
    const d = new Date(ts.manualTime);
    if (!isNaN(d.getTime())) return d;
  }

  if (ts.mode === 'story' || ts.mode === undefined) {
    const storyDate = getStoryDate(cid);
    if (storyDate) return storyDate;
    // story 模式但还没有剧情时间，fallback 到现实时间
  }

  // real 模式或 fallback
  return new Date();
}

// ===== 替换原来的时间函数 =====

function getNowTime(chatId) {
  const now = getChatNow(chatId);
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function getNowFullLabel(chatId) {
  const now = getChatNow(chatId);
  return `${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// ===== 时间设置交互 =====

function onTimeModeChange() {
  if (!currentChatId) return;
  const select = document.getElementById('timeModeSelect');
  if (!select) return;

  const mode = select.value;
  setTimeMode(currentChatId, mode);

  // 显示/隐藏手动时间输入
  const manualRow = document.getElementById('manualTimeRow');
  if (manualRow) {
    manualRow.style.display = mode === 'manual' ? 'flex' : 'none';
  }

  updateTimePreview();
}

function onManualTimeChange() {
  if (!currentChatId) return;
  const input = document.getElementById('manualTimeInput');
  if (!input || !input.value) return;

  setManualTime(currentChatId, input.value);
  updateTimePreview();
}

function updateTimePreview() {
  const el = document.getElementById('timePreviewValue');
  if (!el) return;

  const chatId = currentChatId || '';
  const ts = getTimeSetting(chatId);
  const now = getChatNow(chatId);

  const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let modeLabel = '';
  if (ts.mode === 'story') {
    modeLabel = ts.storyTime ? '（剧情）' : '（等待剧情时间…）';
  } else if (ts.mode === 'manual') {
    modeLabel = '（手动）';
  } else {
    modeLabel = '（现实）';
  }

  el.textContent = timeStr + ' ' + modeLabel;
}

let _timePreviewTimer = null;

function startTimePreviewUpdate() {
  stopTimePreviewUpdate();
  updateTimePreview();
  _timePreviewTimer = setInterval(updateTimePreview, 10000);
}

function stopTimePreviewUpdate() {
  if (_timePreviewTimer) {
    clearInterval(_timePreviewTimer);
    _timePreviewTimer = null;
  }
}

function isSameTimeDivider(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;

  // 解析 "X月X日 HH:MM" 格式为分钟数
  function parseToMinutes(str) {
    const match = str.match(/(\d+)月(\d+)日\s*(\d+):(\d+)/);
    if (!match) return NaN;
    const month = parseInt(match[1]);
    const day = parseInt(match[2]);
    const hour = parseInt(match[3]);
    const minute = parseInt(match[4]);
    return ((month * 31 + day) * 24 + hour) * 60 + minute;
  }

  const minA = parseToMinutes(a);
  const minB = parseToMinutes(b);

  if (isNaN(minA) || isNaN(minB)) return a === b;

  return Math.abs(minA - minB) < 3;
}

function playClickSound() {
  const sound = document.getElementById('clickSound');
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function saveAll(retryMode = 'normal') {
  cleanupLargeState(retryMode);

  const okList = [
    safeSetItemJSON('st_contact_list', contactList),
    safeSetItemJSON('st_group_list', groupList),
    safeSetItemJSON('st_feed_posts', feedPosts),
    safeSetItemJSON('st_messages', messages),
    safeSetItemJSON('st_call_logs', callLogs),
    safeSetItemJSON('st_chat_settings', chatSettings),
    safeSetItemJSON('st_sticker_packs', stickerPacks),
    safeSetItemJSON('st_relationship_settings', relationshipSettings),
    safeSetItemJSON('st_app_profile', appProfile),
    safeSetItemJSON('st_pending_reply_targets', pendingReplyTargets),
    safeSetItemJSON('st_my_profile', myProfile),
    safeSetItemJSON('st_wallet_data', walletData),
    safeSetItemJSON('st_diary_data', diaryData)
  ];

  const success = okList.every(Boolean);

  if (!success && retryMode !== 'aggressive') {
    console.warn('[Storage] 首次保存超额，尝试激进瘦身后重试');
    cleanupLargeState('aggressive');

    const secondTry = [
      safeSetItemJSON('st_contact_list', contactList),
      safeSetItemJSON('st_group_list', groupList),
      safeSetItemJSON('st_feed_posts', feedPosts),
      safeSetItemJSON('st_messages', messages),
      safeSetItemJSON('st_call_logs', callLogs),
      safeSetItemJSON('st_chat_settings', chatSettings),
      safeSetItemJSON('st_sticker_packs', stickerPacks),
      safeSetItemJSON('st_relationship_settings', relationshipSettings),
      safeSetItemJSON('st_app_profile', appProfile),
      safeSetItemJSON('st_pending_reply_targets', pendingReplyTargets),
      safeSetItemJSON('st_my_profile', myProfile),
      safeSetItemJSON('st_wallet_data', walletData),
      safeSetItemJSON('st_diary_data', diaryData)
    ];

    if (!secondTry.every(Boolean)) {
      alert('本地缓存空间已满。\n我已经自动压缩/清理了一部分图片，但仍然超限。\n建议手动清空旧缓存后再使用。');
      return false;
    }

    broadcastVVStateChanged('saveAll-aggressive-success');
    return true;
  }

  if (!success) {
    return false;
  }

  if (STORAGE_DEBUG) {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key) || '';
        total += getApproxSize(value);
      }
      console.log(`[Storage] 当前 localStorage 总占用约 ${(total / 1024).toFixed(1)} KB`);
      if (total > STORAGE_SOFT_LIMIT) {
        console.warn('[Storage] 当前缓存已接近上限，建议减少图片消息/背景/表情');
      }
    } catch (err) {}
  }

  broadcastVVStateChanged('saveAll-success');
  return true;
}

function loadAll() {
  contactList = safeJSONParse(localStorage.getItem('st_contact_list') || '[]', []);
  groupList = safeJSONParse(localStorage.getItem('st_group_list') || '[]', []);
  feedPosts = safeJSONParse(localStorage.getItem('st_feed_posts') || '[]', []);
  messages = safeJSONParse(localStorage.getItem('st_messages') || '{}', {});
  callLogs = safeJSONParse(localStorage.getItem('st_call_logs') || '{}', {});
  chatSettings = safeJSONParse(localStorage.getItem('st_chat_settings') || '{}', {});
  stickerPacks = safeJSONParse(localStorage.getItem('st_sticker_packs') || '[]', []);
  relationshipSettings = safeJSONParse(localStorage.getItem('st_relationship_settings') || '{}', {});
  appProfile = safeJSONParse(localStorage.getItem('st_app_profile') || '{"myName":"我","myAvatar":"","feedCover":""}', {
    myName: '我',
    myAvatar: '',
    feedCover: ''
  });
  pendingReplyTargets = safeJSONParse(localStorage.getItem('st_pending_reply_targets') || '{}', {});

  myProfile = safeJSONParse(localStorage.getItem('st_my_profile') || '{"avatar":"","nickname":"我","avatarUnified":false,"backgroundUnified":false,"globalChatBg":""}', {
    avatar: '',
    nickname: '我',
    avatarUnified: false,
    backgroundUnified: false,
    globalChatBg: ''
  });

  walletData = safeJSONParse(localStorage.getItem('st_wallet_data') || '{"balance":0}', {
    balance: 0
  });

  diaryData = safeJSONParse(
    localStorage.getItem('st_diary_data') || '{"diaries":[]}',
    { diaries: [] }
  );

  if (!diaryData.diaries) {
    diaryData.diaries = [];
  }

  ensureProfileData();
  migrateOversizedLegacyStorage();
}

function updateRealTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const wd = weekdays[now.getDay()];
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateStr = `${month}月${day}日 ${wd}`;

  ['topBarTime', 'topBarTime2', 'topBarTime3', 'topBarTime4', 'topBarTime5', 'topBarTime6'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = timeStr;
  });

  const mainTime = document.getElementById('mainTime');
  const mainDate = document.getElementById('mainDate');
  if (mainTime) mainTime.innerText = timeStr;
  if (mainDate) mainDate.innerText = dateStr;
}

function applyBorderColor(color) {
  const box = document.getElementById('phoneContainer');
  if (box) box.style.setProperty('--phone-border', color);
}

function applyTextColor(color) {
  const box = document.getElementById('phoneContainer');
  if (box) box.style.setProperty('--text-color', color);
}

function applyDialogBgColor(color) {
  document.querySelectorAll('.dialog-content').forEach(function(el) {
    el.style.background = color;
  });
}

function applySavedDialogBgTo(root) {
  var color = localStorage.getItem('st_phone_dialog_bg_color');
  if (!color) return;

  var scope = root || document;
  var contents = scope.querySelectorAll
    ? scope.querySelectorAll('.dialog-content')
    : [];

  contents.forEach(function(el) {
    el.style.background = color;
  });
}

function initColorPickers() {
  const borderPicker = document.getElementById('borderColorPicker');
  const textPicker = document.getElementById('textColorPicker');
  const dialogBgPicker = document.getElementById('dialogBgColorPicker');
  if (!borderPicker || !textPicker) return;

  const savedBorder = localStorage.getItem('st_phone_border_color');
  const savedText = localStorage.getItem('st_phone_text_color');
  const savedDialogBg = localStorage.getItem('st_phone_dialog_bg_color');

  if (savedBorder) {
    borderPicker.value = savedBorder;
    applyBorderColor(savedBorder);
  } else {
    applyBorderColor('#363636');
  }

  if (savedText) {
    textPicker.value = savedText;
    applyTextColor(savedText);
  } else {
    applyTextColor('#ffffff');
  }

  if (dialogBgPicker) {
    if (savedDialogBg) {
      dialogBgPicker.value = savedDialogBg;
      applyDialogBgColor(savedDialogBg);
    } else {
      applyDialogBgColor('#fde5ec');
    }

    dialogBgPicker.addEventListener('input', e => {
      applyDialogBgColor(e.target.value);
      localStorage.setItem('st_phone_dialog_bg_color', e.target.value);
    });
  }

  borderPicker.addEventListener('input', e => {
    applyBorderColor(e.target.value);
    localStorage.setItem('st_phone_border_color', e.target.value);
  });

  textPicker.addEventListener('input', e => {
    applyTextColor(e.target.value);
    localStorage.setItem('st_phone_text_color', e.target.value);
  });
}

function updateBgStyle() {
  const opacityEl = document.getElementById('bgOpacity');
  const blurEl = document.getElementById('bgBlur');
  const overlay = document.querySelector('.screen-bg-overlay');
  if (!opacityEl || !blurEl || !overlay) return;

  const opacity = opacityEl.value;
  const blur = blurEl.value;
  overlay.style.background = `rgba(0,0,0,${opacity})`;
  overlay.style.backdropFilter = `blur(${blur}px)`;

  safeSetItemJSON('st_phone_bg', { opacity, blur });
}

function restoreBgStyle() {
  const overlay = document.querySelector('.screen-bg-overlay');
  if (!overlay) return;

  const bgSettings = safeJSONParse(localStorage.getItem('st_phone_bg') || '{"opacity":0.2,"blur":3}', {
    opacity: 0.2,
    blur: 3
  });

  overlay.style.background = `rgba(0,0,0,${bgSettings.opacity})`;
  overlay.style.backdropFilter = `blur(${bgSettings.blur}px)`;

  const bgOpacity = document.getElementById('bgOpacity');
  const bgBlur = document.getElementById('bgBlur');
  if (bgOpacity) bgOpacity.value = bgSettings.opacity;
  if (bgBlur) bgBlur.value = bgSettings.blur;
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;
  dialog.classList.remove('show');

  setTimeout(() => {
    dialog.style.display = 'none';

    if (dialogId === 'settingDialog') {
      const iconSelect = document.getElementById('iconSelect');
      const imageUpload = document.getElementById('imageUpload');
      const box = document.querySelector('#settingDialog .preview-box');
      if (iconSelect) iconSelect.value = '';
      if (imageUpload) imageUpload.value = '';
      if (box) box.innerHTML = '<span>图片预览区</span>';
      currentUploadImage = '';
    }

    if (dialogId === 'addContactDialog') {
      const a = document.getElementById('contactName');
      const b = document.getElementById('contactBridgeName');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'addCallDialog') {
      const el = document.getElementById('callTargetName');
      if (el) {
        el.value = '';
        delete el.dataset.selectedId;
      }
      const suggestions = document.getElementById('callContactSuggestions');
      if (suggestions) suggestions.innerHTML = '';
    }

    if (dialogId === 'addGroupDialog') {
      const a = document.getElementById('groupName');
      const b = document.getElementById('groupMembers');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'postFeedDialog') {
      const input = document.getElementById('feedContentInput');
      const files = document.getElementById('feedPostImages');
      const preview = document.getElementById('feedPostPreview');
      if (input) input.value = '';
      if (files) files.value = '';
      currentFeedImages = [];
      if (preview) preview.innerHTML = '<span>最多9张图片</span>';
    }

    if (dialogId === 'transferDialog') {
      const a = document.getElementById('transferAmount');
      const b = document.getElementById('transferNote');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'imageSendDialog') {
      const a = document.getElementById('sendImageInput');
      const b = document.getElementById('sendImageDesc');
      const preview = document.getElementById('sendImagePreviewBox');
      if (a) a.value = '';
      if (b) b.value = '';
      currentSendImageData = '';
      if (preview) preview.innerHTML = '<span>图片预览区</span>';
    }

    if (dialogId === 'voiceDialog') {
      const a = document.getElementById('voiceTextInput');
      const b = document.getElementById('voiceDurationInput');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'fontDialog') {
      const a = document.getElementById('importFontName');
      const b = document.getElementById('importFontFile');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'stickerImportDialog') {
      const a = document.getElementById('stickerNameInput');
      const b = document.getElementById('stickerUrlInput');
      const c = document.getElementById('stickerFileInput');
      const preview = document.getElementById('stickerImportPreview');
      if (a) a.value = '';
      if (b) b.value = '';
      if (c) c.value = '';
      if (preview) preview.innerHTML = '<span>表情预览区</span>';
      currentUploadImage = '';
    }
  }, 300);
}

function showDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  if (typeof applyCurrentFontTo === 'function') {
    applyCurrentFontTo(dialog);
  }

  dialog.style.display = 'flex';

  requestAnimationFrame(() => {
    dialog.classList.add('show');
  });
}

function fileToDataURL(file, callback, options = {}) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async e => {
    let result = e.target.result;

    if (options.compress && file.type.startsWith('image/')) {
      result = await compressImage(
        result,
        options.maxWidth || 1000,
        options.quality || 0.72
      );
    }

    callback(result);
  };
  reader.readAsDataURL(file);
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  fileToDataURL(file, data => {
    currentUploadImage = data;
    const box = document.querySelector('#settingDialog .preview-box');
    if (box) box.innerHTML = `<img src="${data}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
  }, {
    compress: true,
    maxWidth: 1000,
    quality: 0.72
  });
}

async function confirmReplace() {
  const target = document.getElementById('iconSelect')?.value;

  if (!target || !currentUploadImage) {
    alert('请选择目标和图片！');
    return;
  }

  // 记录开始替换时的主题，防止上传过程中切换主题
  const themeAtStart = localStorage.getItem('st_phone_theme') || 'default';

  // 本次替换操作的 token
  const replaceToken = Date.now() + '_' + Math.random();

  // 如果替换的是壁纸，就打断之前还没结束的壁纸恢复任务
  if (target === 'wallpaper') {
    window.__vvThemeSwitchToken = replaceToken;
  }

  const storedRef = await persistImageToIDB(currentUploadImage, {
    area: 'phone_icons',
    key: target
  });

  const finalSrc = await resolveImageRefToUrl(storedRef);

  if (!finalSrc) {
    alert('图片处理失败，请重试');
    return;
  }

  // 上传过程中如果主题变了，不再把这张图应用到新主题上
  const themeNow = localStorage.getItem('st_phone_theme') || 'default';

  if (target === 'wallpaper' && themeNow !== themeAtStart) {
    alert('主题已切换，请重新选择背景');
    return;
  }

  const saved = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});

  saved[target] = storedRef;

  savePhoneIconsSafely(saved);

  if (target === 'wallpaper') {
    if (window.__vvThemeSwitchToken !== replaceToken) {
      return;
    }

    applyUserWallpaperUrl(finalSrc);
  } else {
    const el = document.getElementById(target);
    if (el) {
      el.src = finalSrc;
    }
  }

  alert('替换成功！');
  currentUploadImage = null;
  closeDialog('settingDialog');
}

function applyUserWallpaperUrl(url) {
  const phone = document.querySelector('.phone-container');
  if (!phone || !url) return;

  phone.style.backgroundImage = `url("${url}")`;
  phone.style.backgroundSize = 'cover';
  phone.style.backgroundPosition = 'center';
}

async function restoreIcons() {
  const savedIcons = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  for (const [iconId, imageSrc] of Object.entries(savedIcons)) {
    const safeSrc = imageSrc || '';
    if (!safeSrc) continue;

    const finalSrc = await resolveImageRefToUrl(safeSrc);

    if (iconId === 'wallpaper') {
      const phone = document.querySelector('.phone-container');
      if (phone) phone.style.backgroundImage = `url(${finalSrc})`;
    } else {
      const el = document.getElementById(iconId);
      if (el) el.src = finalSrc;
    }
  }
}

function hideAllPages() {
  ['homePage', 'contactPage', 'chatDetailPage', 'callPage', 'incomingCallPage', 'chatSettingPage','diaryPage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function openContactPage() {
  hideAllPages();
  const page = document.getElementById('contactPage');
  if (page) page.style.display = 'block';
  renderAllPanels();
  renderFeedHeader();
}

function backToHome() {
  hideAllPages();
  const page = document.getElementById('homePage');
  if (page) page.style.display = 'block';
}

function backToContactList() {
  const a = document.getElementById('chatDetailPage');
  const b = document.getElementById('contactPage');
  if (a) a.style.display = 'none';
  if (b) b.style.display = 'block';
  renderAllPanels();
}

function backToChatDetail() {
  const a = document.getElementById('chatSettingPage');
  const b = document.getElementById('chatDetailPage');
  if (a) a.style.display = 'none';
  if (b) b.style.display = 'block';
  renderMessages();
  stopTimePreviewUpdate();
}

function closeCallPage() {
  if (currentCallPhase === 'talking') {
    if (!confirm('通话进行中，确定要离开吗？这将挂断电话。')) return;
    endCall();
  }
  hideAllPages();
  const page = document.getElementById('homePage');
  if (page) page.style.display = 'block';
}

function switchContactTab(tab) {
  const directPanel = document.getElementById('directPanel');
  const groupPanel = document.getElementById('groupPanel');
  const feedPanel = document.getElementById('feedPanel');
  const profilePage = document.getElementById('profilePage');

  const titleEl = document.querySelector('#contactPage .nav-title');
  const navAction = document.querySelector('#contactPage .nav-action');

  if (directPanel) {
    directPanel.style.display = tab === 'direct' ? 'block' : 'none';
    directPanel.classList.toggle('active', tab === 'direct');
  }

  if (groupPanel) {
    groupPanel.style.display = tab === 'group' ? 'block' : 'none';
    groupPanel.classList.toggle('active', tab === 'group');
  }

  if (feedPanel) {
    feedPanel.style.display = tab === 'feed' ? 'block' : 'none';
    feedPanel.classList.toggle('active', tab === 'feed');
  }

  if (profilePage) {
    profilePage.style.display = tab === 'profile' ? 'block' : 'none';
    profilePage.classList.toggle('active', tab === 'profile');
  }

  document.querySelectorAll('.contact-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });

  if (titleEl) {
    if (tab === 'direct') titleEl.textContent = '消息';
    else if (tab === 'group') titleEl.textContent = '群聊';
    else if (tab === 'feed') titleEl.textContent = '动态';
    else if (tab === 'profile') titleEl.textContent = '我的';
  }

  if (navAction) {
    if (tab === 'profile') {
      navAction.style.display = 'none';
      navAction.textContent = '';
      navAction.onclick = null;
    } else if (tab === 'feed') {
      navAction.style.display = 'flex';
      navAction.textContent = '＋';
      navAction.onclick = () => {
        playClickSound?.();
        showDialog('feedChoiceDialog');
      };
    } else {
      navAction.style.display = 'flex';
      navAction.textContent = '＋';
      navAction.onclick = () => {
        playClickSound?.();
        handleTopAdd?.();
      };
    }
  }

  if (tab === 'feed') {
    renderFeedHeader?.();
    renderFeedList?.();
  }

  if (tab === 'profile') {
    updateProfileUI?.();
  }
}

function handleTopAdd() {
  if (currentContactTab === 'direct') showDialog('addContactDialog');
  if (currentContactTab === 'group') showDialog('addGroupDialog');
  if (currentContactTab === 'feed') showDialog('postFeedDialog');
}

function getChatSetting(chatId) {
  if (!chatId) {
    console.warn('[getChatSetting] invalid chatId:', chatId);
    return {
      background: '',
      backgroundBase: '',
      backgroundOverride: '',
      myAvatar: '',
      myAvatarBase: '',
      myAvatarOverride: '',
      theirAvatar: ''
    };
  }

  if (!chatSettings[chatId]) {
    chatSettings[chatId] = {
      background: '',
      backgroundBase: '',
      backgroundOverride: '',
      myAvatar: '',
      myAvatarBase: '',
      myAvatarOverride: '',
      theirAvatar: ''
    };
  }

  return chatSettings[chatId];
}

function getRelSetting(id) {
  if (!relationshipSettings[id]) {
    relationshipSettings[id] = {
      blockedByMe: false,
      blockedByThem: false
    };
  }
  return relationshipSettings[id];
}

function getCurrentChatName(id, type = 'direct') {
  const list = type === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === id);
  return item ? item.name : '联系人';
}

function getBridgeNameByChatId(chatId, type = 'direct') {
  if (type === 'group') {
    const group = groupList.find(i => i.id === chatId);
    return group?.bridgeName || group?.name || '群聊';
  }
  const contact = contactList.find(i => i.id === chatId);
  return contact?.bridgeName || contact?.name || '角色';
}

function buildLatestUserPayload(chatId) {
  const list = messages[chatId] || [];
  const myRecent = [...list].reverse().filter(m => m.isMe && !m.recalled).slice(0, 8).reverse();

  if (!myRecent.length) return '请继续回复刚才的话题。';

  return myRecent.map(m => {
    if (m.type === 'text') return (m.chunks || []).join('\n');
    if (m.type === 'sticker') return `[表情] ${m.stickerName || '表情'}`;
    if (m.type === 'image') return `[图片] ${m.desc || ''}`.trim();
    if (m.type === 'voice') return `[语音] ${m.transcript || ''}`.trim();
    if (m.type === 'transfer') return `[转账] 金额${m.amount}，备注${m.note || '无'}`;
    if (m.type === 'system') return `[系统] ${(m.chunks || []).join(' / ')}`;
    return '[消息]';
  }).join('\n');
}

function renderAllPanels() {
  renderChatList();
  renderGroupList();
  renderFeedList();
}

function getMessageSummary(m) {
  if (!m) return '暂无消息';
  if (m.recalled) return '撤回了一条消息';
  switch (m.type) {
    case 'text':
      return m.chunks?.[0] || '文字消息';
    case 'sticker':
      return `[表情] ${m.stickerName || '表情'}`;
    case 'image':
      return `[图片]${m.desc ? ' ' + m.desc : ''}`;
    case 'voice':
      return `[语音]${m.transcript ? ' ' + m.transcript : ''}`;
    case 'transfer':
      return `[转账] ¥${m.amount}`;
    case 'system':
      return m.chunks?.[0] || '系统消息';
    default:
      return '消息';
  }
}

function generateItem(item, type) {
  const lastMsg = getMessageSummary(messages[item.id]?.slice(-1)[0]);
  const typeLabel = type === 'group' ? '群聊' : '单聊';
  const rel = getRelSetting(item.id);
  const avatar = type === 'direct'
    ? (getChatSetting(item.id).theirAvatar || item.avatar || DEFAULT_AVATAR)
    : (item.avatar || DEFAULT_AVATAR);

  // 优先显示 displayName（备注），其次 name，最后 bridgeName
  const showName = item.displayName || item.name || item.bridgeName || '联系人';

  return `
    <div class="chat-item" data-id="${item.id}" onclick="openChat('${item.id}','${type}')" oncontextmenu="showOperationMenu(event,'${item.id}')">
      ${item.isSticky ? '<div class="sticky-tag">置顶</div>' : ''}
      <div class="chat-avatar"><img ${buildMediaSrcAttrs(avatar)} alt=""></div>
      <div class="chat-info">
        <div class="chat-name-row">
          <div class="chat-name">${escapeHTML(showName)}${rel.blockedByMe ? '（已拉黑）' : ''}</div>
        </div>
        <div class="chat-time">${escapeHTML(item.lastTime || '')}</div>
        <div class="chat-last-msg">${escapeHTML(lastMsg)}</div>
      </div>
    </div>
  `;
}

function renderChatList() {
  const dom = document.getElementById('chatList');
  if (!dom) return;

  if (contactList.length === 0) {
    dom.innerHTML = `<div class="empty-state"><span>暂无联系人，点击右上角＋添加</span></div>`;
    return;
  }

  const sticky = contactList.filter(i => i.isSticky);
  const normal = contactList.filter(i => !i.isSticky);

  let html = '';
  if (sticky.length) {
    html += '<div class="sticky-title">置顶</div>';
    sticky.forEach(i => html += generateItem(i, 'direct'));
  }
  if (normal.length) {
    html += '<div class="sticky-title">朋友</div>';
    normal.forEach(i => html += generateItem(i, 'direct'));
  }

  dom.innerHTML = html;
  hydrateMediaRefs(dom);
}

function renderGroupList() {
  const dom = document.getElementById('groupList');
  if (!dom) return;

  if (groupList.length === 0) {
    dom.innerHTML = `<div class="empty-state"><span>暂无群聊，点击右上角＋创建</span></div>`;
    return;
  }

  dom.innerHTML = '<div class="sticky-title">我的群聊</div>' + groupList.map(i => generateItem(i, 'group')).join('');
  hydrateMediaRefs(dom);
}

async function renderFeedHeader() {
  const avatarEl = document.getElementById('feedMyAvatar');
  const nameEl = document.getElementById('feedUserName');
  const coverEl = document.getElementById('feedCover');
  if (!avatarEl || !nameEl || !coverEl) return;

  const myAvatar = getMyProfileAvatar();
  const cover = appProfile.feedCover || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=900&auto=format&fit=crop';

  avatarEl.src = await resolveImageRefToUrl(myAvatar);
  nameEl.innerText = myProfile.nickname || appProfile.myName || '我';
  coverEl.style.backgroundImage = `url(${await resolveImageRefToUrl(cover)})`;
}

function renderFeedList() {
  const dom = document.getElementById('feedList');
  if (!dom) return;

  if (feedPosts.length === 0) {
    dom.innerHTML = `<div class="empty-state" style="height:220px;"><span>还没有动态，点击右上角发布</span></div>`;
    return;
  }

  const myName = myProfile.nickname || appProfile.myName || '我';
  const myNames = new Set([
    '我',
    myProfile.nickname || '',
    appProfile.myName || ''
  ].filter(Boolean));

  dom.innerHTML = feedPosts.map(post => {
    const isMine = post.authorId === 'me' || myNames.has(post.author);
    const postAvatar = getFeedAuthorAvatar(post);

    const rawImages = (post.images || []).slice(0, 9); // 最多9张
    const imgCount = rawImages.length;

    // 决定每行列数：1张=1列，2张=2列，其余=3列
    const gridCols = imgCount === 1 ? 1 : imgCount === 2 ? 2 : 3;

    const images = imgCount ? `
      <div class="feed-image-grid feed-image-grid--${gridCols}col">
        ${rawImages.map(src => {
          if (src && src.simulated) {
            return `<div class="feed-simulated-image feed-simulated-image--thumb">
              <span class="feed-sim-icon">🖼</span>
              <span class="feed-sim-desc">${escapeHTML(src.desc || '图片')}</span>
            </div>`;
          }
          return `<img ${buildMediaSrcAttrs(src)} alt="" onclick="openFeedImageViewerFromNode(this)">`;
        }).join('')}
      </div>
    ` : '';

    const likes = (post.likes || []).length
      ? `<div class="feed-comment">❤️ ${(post.likes || []).map(i => `<strong>${escapeHTML(i.from)}</strong>`).join('、')}</div>`
      : '';

    const comments = (post.comments || []).map((c, idx) => {
      const isMyComment = c.from === myName;
      const cleanText = (c.text || '').replace(/\s*replyTo=[^\s\n]*/g, '').trim();

      return `
        <div class="feed-comment">
          <strong>${escapeHTML(c.from)}</strong>${c.replyTo ? ` 回复 <strong>${escapeHTML(c.replyTo)}</strong>` : ''}：${escapeHTML(cleanText)}
          <span style="color:#999;cursor:pointer;margin-left:8px;" data-feed-action="reply-comment" data-post-id="${escapeHTML(post.id)}" data-comment-index="${idx}" onclick="replyFeedComment('${post.id}',${idx})">回复</span>
          <span style="color:#d9534f;cursor:pointer;margin-left:8px;" data-feed-action="delete-comment" data-post-id="${escapeHTML(post.id)}" data-comment-index="${idx}" onclick="deleteFeedComment('${post.id}',${idx})">删除</span>
        </div>
      `;
    }).join('');

    return `
      <div class="feed-card">
        <div class="feed-post-avatar"><img ${buildMediaSrcAttrs(postAvatar)} alt=""></div>
        <div class="feed-main">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div class="feed-author">${escapeHTML(post.author)}</div>
            <button class="feed-delete-btn" data-feed-action="delete-post" data-post-id="${escapeHTML(post.id)}" onclick="deleteFeedPost('${post.id}')">删除</button>
          </div>
          <div class="feed-content">${escapeHTML(post.content)}</div>
          ${images}
          <div class="feed-meta-row">
            <div class="feed-meta">${escapeHTML(post.time)}</div>
            <div>
              <button class="feed-op-btn" data-feed-action="like" data-post-id="${escapeHTML(post.id)}" onclick="toggleFeedLike('${post.id}')">点赞</button>
              <button class="feed-op-btn" data-feed-action="comment" data-post-id="${escapeHTML(post.id)}" onclick="feedQuickComment('${post.id}')">评论</button>
            </div>
          </div>
          <div class="feed-comment-box">
            ${likes}
            ${comments || '<div class="feed-comment">还没有评论</div>'}
          </div>
        </div>
      </div>
    `;
  }).join('');

  hydrateMediaRefs(dom);
}

function openFeedImageViewerFromNode(imgEl) {
  if (!imgEl) return;
  const src = imgEl.currentSrc || imgEl.src;
  if (!src) return;

  const viewer = document.getElementById('feedImageViewer');
  const viewerImg = document.getElementById('feedImageViewerImg');
  if (!viewer || !viewerImg) return;

  viewerImg.src = src;
  viewer.style.display = 'flex';

  requestAnimationFrame(() => {
    viewer.classList.add('show');
  });
}

function closeFeedImageViewer() {
  const viewer = document.getElementById('feedImageViewer');
  const viewerImg = document.getElementById('feedImageViewerImg');
  if (!viewer || !viewerImg) return;

  viewer.classList.remove('show');
  setTimeout(() => {
    viewer.style.display = 'none';
    viewerImg.src = '';
  }, 200);
}

window.__VV_LAST_LOCAL_FEED_OPERATION_AT__ = window.__VV_LAST_LOCAL_FEED_OPERATION_AT__ || 0;

function markLocalFeedOperation(reason) {
  window.__VV_LAST_LOCAL_FEED_OPERATION_AT__ = Date.now();
  console.log('[VV][FEED] local operation:', reason || '');
}

function toggleFeedLike(postId) {
  markLocalFeedOperation('like');

  const post = feedPosts.find(i => String(i.id) === String(postId) || String(i.postId) === String(postId));
  if (!post) {
    console.warn('[VV][FEED] toggleFeedLike: post not found', postId);
    return;
  }

  const myName = myProfile.nickname || appProfile.myName || '我';

  post.likes = post.likes || [];

  const idx = post.likes.findIndex(function (i) {
    return i && i.from === myName;
  });

  if (idx >= 0) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push({ from: myName });
  }

  post.likes = dedupeFeedLikes ? dedupeFeedLikes(post.likes) : post.likes;

  saveAll();
  renderFeedList();

  console.log('[VV][FEED] like toggled:', postId);
}

async function feedQuickComment(postId) {
  markLocalFeedOperation('comment');

  const post = feedPosts.find(i => String(i.id) === String(postId) || String(i.postId) === String(postId));
  if (!post) {
    console.warn('[VV][FEED] feedQuickComment: post not found', postId);
    return;
  }

  const text = prompt('输入评论内容');
  if (!text) return;

  post.comments = post.comments || [];
  post.comments.push({
    from: myProfile.nickname || appProfile.myName || '我',
    text: text
  });

  post.comments = dedupeFeedComments ? dedupeFeedComments(post.comments) : post.comments;

  saveAll();
  renderFeedList();

  const triggerAI = confirm('是否让AI角色回复这条评论？');
  if (triggerAI) {
    const bridgeName = post.bridgeName || post.author || '角色';
    let slashOk = false;

    if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.feedMode === 'slash' || VV_BRIDGE_CONFIG.feedMode === 'local+slash')) {
      const cmd = VV_BRIDGE_CONFIG.buildFeedCommentCommand({
        bridgeName,
        postId,
        promptText: `用户评论了你的动态：${text}\n请以动态作者身份进行一条自然回复，不要模拟用户。`
      });

      const now = new Date();
      const timeStr = (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      slashOk = await triggerSlash(cmd, {
        feedMode: true,
        userInteraction: {
          postId: postId,
          from: myProfile.nickname || appProfile.myName || '我',
          time: timeStr,
          action: 'comment',
          content: text,
          replyTo: ''
        }
      });
    }

    if (!slashOk || VV_BRIDGE_CONFIG.feedMode === 'local') {
      markLocalFeedOperation('local-ai-comment-fallback');

      post.comments.push({
        from: '角色',
        text: '我看到了你的评论。'
      });

      post.comments = dedupeFeedComments ? dedupeFeedComments(post.comments) : post.comments;

      saveAll();
      renderFeedList();
    }
  }

  console.log('[VV][FEED] comment added:', postId);
}

async function replyFeedComment(postId, commentIndex) {
  markLocalFeedOperation('reply-comment');

  const post = feedPosts.find(i => String(i.id) === String(postId) || String(i.postId) === String(postId));
  if (!post) {
    console.warn('[VV][FEED] replyFeedComment: post not found', postId);
    return;
  }

  post.comments = post.comments || [];

  const target = post.comments[Number(commentIndex)];
  if (!target) {
    console.warn('[VV][FEED] replyFeedComment: comment not found', postId, commentIndex);
    return;
  }

  const text = prompt(`回复 ${target.from}`);
  if (!text) return;

  post.comments.push({
    from: myProfile.nickname || appProfile.myName || '我',
    replyTo: target.from,
    text: text
  });

  post.comments = dedupeFeedComments ? dedupeFeedComments(post.comments) : post.comments;

  saveAll();
  renderFeedList();

  const triggerAI = confirm('是否让AI角色回复你的这条评论？');
  if (triggerAI) {
    const bridgeName = post.bridgeName || post.author || '角色';
    let slashOk = false;

    if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.feedMode === 'slash' || VV_BRIDGE_CONFIG.feedMode === 'local+slash')) {
      const cmd = VV_BRIDGE_CONFIG.buildFeedCommentCommand({
        bridgeName,
        postId,
        promptText: `用户回复了评论。\n原评论人:${target.from}\n用户回复内容:${text}\n请以角色身份进行一条自然回复，不要模拟用户。`
      });

      const now = new Date();
      const timeStr = (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      slashOk = await triggerSlash(cmd, {
        feedMode: true,
        userInteraction: {
          postId: postId,
          from: myProfile.nickname || appProfile.myName || '我',
          time: timeStr,
          action: 'comment',
          content: text,
          replyTo: target.from
        }
      });
    }

    if (!slashOk || VV_BRIDGE_CONFIG.feedMode === 'local') {
      markLocalFeedOperation('local-ai-reply-fallback');

      post.comments.push({
        from: '角色',
        replyTo: myProfile.nickname || appProfile.myName || '我',
        text: '我来接一句。'
      });

      post.comments = dedupeFeedComments ? dedupeFeedComments(post.comments) : post.comments;

      saveAll();
      renderFeedList();
    }
  }

  console.log('[VV][FEED] reply comment added:', postId, commentIndex);
}

function deleteFeedPost(postId) {
  markLocalFeedOperation('delete-post');

  const index = feedPosts.findIndex(post => String(post.id) === String(postId) || String(post.postId) === String(postId));
  if (index === -1) {
    console.warn('[VV][FEED] deleteFeedPost: post not found', postId);
    return;
  }

  const ok = confirm('确定删除这条动态吗？');
  if (!ok) return;

  feedPosts.splice(index, 1);

  saveAll();
  renderFeedList();

  console.log('[VV][FEED] post deleted:', postId);
}

function deleteFeedComment(postId, commentIndex) {
  markLocalFeedOperation('delete-comment');

  const post = feedPosts.find(i => String(i.id) === String(postId) || String(i.postId) === String(postId));
  if (!post) {
    console.warn('[VV][FEED] deleteFeedComment: post not found', postId);
    return;
  }

  post.comments = post.comments || [];

  const index = Number(commentIndex);

  if (!post.comments[index]) {
    console.warn('[VV][FEED] deleteFeedComment: comment not found', postId, commentIndex);
    return;
  }

  const ok = confirm('确定删除这条评论吗？');
  if (!ok) return;

  post.comments.splice(index, 1);

  saveAll();
  renderFeedList();

  console.log('[VV][FEED] comment deleted:', postId, commentIndex);
}

// ===== 获取所有不重复的已绑定角色列表 =====
function getUniqueBridgeNames() {
  if (!Array.isArray(contactList)) return [];
  const map = {};
  contactList.forEach(item => {
    const bn = String(item.bridgeName || item.name || '').trim();
    if (!bn) return;
    if (!map[bn]) {
      map[bn] = { bridgeName: bn, count: 0 };
    }
    map[bn].count++;
  });
  return Object.values(map);
}

// ===== 打开"已绑定角色"弹窗时，渲染列表 =====
let _selectedExistingBridge = '';

function renderExistingBridgeList() {
  const container = document.getElementById('existingBridgeList');
  if (!container) return;

  const bridges = getUniqueBridgeNames();
  _selectedExistingBridge = '';

  if (bridges.length === 0) {
    container.innerHTML = '<div class="bridge-list-empty">暂无已绑定角色，请选择"新绑定角色"</div>';
    return;
  }

  container.innerHTML = bridges.map(b => {
    return `<div class="bridge-list-item" onclick="selectExistingBridge(this, '${escapeHTML(b.bridgeName)}')" data-bridge="${escapeHTML(b.bridgeName)}">
      <div class="bridge-item-name">${escapeHTML(b.bridgeName)}</div>
      <div class="bridge-item-count">已有 ${b.count} 个会话</div>
    </div>`;
  }).join('');
}

function selectExistingBridge(el, bridgeName) {
  _selectedExistingBridge = bridgeName;

  // 高亮选中
  const container = document.getElementById('existingBridgeList');
  if (container) {
    container.querySelectorAll('.bridge-list-item').forEach(item => {
      item.classList.remove('selected');
    });
  }
  el.classList.add('selected');

  // 自动填入默认备注名
  const input = document.getElementById('existingBridgeDisplayName');
  if (input && !input.value.trim()) {
    input.placeholder = '备注名（默认：' + bridgeName + '）';
  }
}

// ===== 从已绑定角色新建会话 =====
function addContactFromExisting() {
  if (!_selectedExistingBridge) {
    alert('请先选择一个已绑定角色');
    return;
  }

  const bridgeName = _selectedExistingBridge;
  const displayName = document.getElementById('existingBridgeDisplayName')?.value.trim() || bridgeName;

  createNewContact(bridgeName, displayName);

  // 清理
  _selectedExistingBridge = '';
  const input = document.getElementById('existingBridgeDisplayName');
  if (input) input.value = '';
  closeDialog('existingBridgeDialog');
}

// ===== 新绑定角色 =====
function addContactFromNew() {
  const bridgeName = document.getElementById('newBridgeName')?.value.trim();
  const displayName = document.getElementById('newBridgeDisplayName')?.value.trim();

  if (!bridgeName) {
    alert('请输入绑定角色名！');
    return;
  }

  createNewContact(bridgeName, displayName || bridgeName);

  // 清理
  const b = document.getElementById('newBridgeName');
  if (b) b.value = '';
  const d = document.getElementById('newBridgeDisplayName');
  if (d) d.value = '';
  closeDialog('newBridgeDialog');
}

// ===== 核心：创建新联系人/会话 =====
function createNewContact(bridgeName, displayName) {
  const id = 'c' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const time = getNowTime();

  contactList.unshift({
    id,
    name: displayName,                     // 兼容旧代码
    displayName: displayName,              // 备注名
    bridgeName: bridgeName,                // 绑定角色名
    avatar: DEFAULT_AVATAR,
    isSticky: false,
    lastTime: time,
    threadType: 'direct'
  });

  messages[id] = [{
    id: 'm' + Date.now(),
    sender: 'system',
    senderName: '系统',
    isMe: false,
    type: 'system',
    chunks: ['已建立联系，开始聊天吧~'],
    time,
    timeLabel: getNowFullLabel()
  }];

  getChatSetting(id);
  getRelSetting(id);

  saveAll();
  renderChatList();

  console.log('[VV] createNewContact:', { id, bridgeName, displayName });
}

// ===== 覆盖 showDialog，让已绑定角色弹窗自动渲染列表 =====
const _origShowDialog = showDialog;
showDialog = function(dialogId) {
  if (dialogId === 'existingBridgeDialog') {
    renderExistingBridgeList();
  }
  _origShowDialog(dialogId);
};

// ===== 长按改备注 =====
let _longPressTimer = null;

function initChatTitleLongPress() {
  const titleEl = document.getElementById('chatDetailName');
  if (!titleEl) return;
  if (titleEl._longPressInited) return;
  titleEl._longPressInited = true;

  // 触摸设备
  titleEl.addEventListener('touchstart', function(e) {
    _longPressTimer = setTimeout(function() {
      openRenameDialog();
    }, 600);
  }, { passive: true });

  titleEl.addEventListener('touchend', function() {
    clearTimeout(_longPressTimer);
  });

  titleEl.addEventListener('touchmove', function() {
    clearTimeout(_longPressTimer);
  });

  // 鼠标设备
  titleEl.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    _longPressTimer = setTimeout(function() {
      openRenameDialog();
    }, 600);
  });

  titleEl.addEventListener('mouseup', function() {
    clearTimeout(_longPressTimer);
  });

  titleEl.addEventListener('mouseleave', function() {
    clearTimeout(_longPressTimer);
  });
}

function openRenameDialog() {
  if (!currentChatId) return;

  const list = currentChatType === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === currentChatId);
  if (!item) return;

  const input = document.getElementById('renameInput');
  const info = document.getElementById('renameInfo');

  if (input) {
    input.value = item.displayName || item.name || '';
  }
  if (info) {
    info.textContent = '绑定角色：' + (item.bridgeName || item.name || '未知');
  }

  showDialog('renameDialog');
}

function confirmRename() {
  if (!currentChatId) return;

  const input = document.getElementById('renameInput');
  const newName = input?.value.trim();

  if (!newName) {
    alert('备注名不能为空');
    return;
  }

  const list = currentChatType === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === currentChatId);
  if (!item) return;

  item.displayName = newName;
  item.name = newName;  // 兼容旧代码

  // 更新顶栏
  const title = document.getElementById('chatDetailName');
  if (title) title.innerText = newName;

  saveAll();
  renderChatList();
  closeDialog('renameDialog');

  console.log('[VV] renamed:', { chatId: currentChatId, newName, bridgeName: item.bridgeName });
}

// ===== 页面加载后初始化长按 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatTitleLongPress);
} else {
  initChatTitleLongPress();
}

function addGroup() {
  const name = document.getElementById('groupName')?.value.trim();
  const membersRaw = document.getElementById('groupMembers')?.value.trim();

  if (!name) {
    alert('请输入群聊名称');
    return;
  }

  const members = String(membersRaw || '').split('\n').map(i => i.trim()).filter(Boolean);
  const id = 'g' + Date.now();
  const time = getNowTime();

  groupList.unshift({
    id,
    name,
    bridgeName: name,
    avatar: DEFAULT_AVATAR,
    isSticky: false,
    lastTime: time,
    members
  });

  messages[id] = [{
    id: 'm' + Date.now(),
    sender: 'system',
    senderName: '系统',
    isMe: false,
    type: 'system',
    chunks: [`群聊「${name}」已创建`, members.length ? `成员：${members.join('、')}` : '暂时还没有成员'],
    time,
    timeLabel: getNowFullLabel()
  }];

  saveAll();
  renderGroupList();
  closeDialog('addGroupDialog');
}

async function addFeedPost() {
  const content = document.getElementById('feedContentInput')?.value.trim();

  if (!content && !currentFeedImages.length) {
    alert('请输入动态内容或选择图片');
    return;
  }

  const storedImages = [];
  for (const img of [...currentFeedImages].slice(0, 9)) {
    storedImages.push(await persistImageToIDB(img, { area: 'feed.post.image' }));
  }

  const postId = 'f' + Date.now();
  const author = myProfile.nickname || appProfile.myName || '我';
  const timeStr = getNowTime();

  feedPosts.unshift({
    id: postId,
    authorId: 'me',
    author: author,
    authorAvatar: getMyProfileAvatar() || DEFAULT_AVATAR,
    bridgeName: author,
    content,
    time: timeStr,
    images: storedImages,
    likes: [],
    comments: []
  });

  saveAll();
  renderFeedList();
  closeDialog('postFeedDialog');

  // 触发同层 AI 互动
  if (VV_BRIDGE_CONFIG.enabled) {
    // 构建图片描述（给 AI 看的文字）
    const photoDesc = storedImages.map((img, idx) => {
      const desc = img.desc || '图片';
      return '[图' + (idx + 1) + ':' + desc + ']';
    }).join('');

    const cmd = VV_BRIDGE_CONFIG.buildFeedEventCommand({
      postId, content, images: storedImages, author
    });
    console.log('[VV][FEED] triggering feed sync, postId =', postId);
    try {
      await triggerSlash(cmd, {
        feedMode: true,
        feedMeta: {
          postId: postId,
          author: author,
          time: timeStr,
          content: content,
          images: storedImages.map(i => i.id || i.src || ''),
          photoDesc: photoDesc || '',
          location: ''
        }
      });
    } catch (err) {
      console.error('[VV][FEED] triggerSlash error:', err);
    }
  }
}

async function addAiFeedPost() {
  if (!_selectedAiFeedContactId) {
    alert('请先选择一个发布身份');
    return;
  }

  const contact = contactList.find(c => c.id === _selectedAiFeedContactId);
  if (!contact) {
    alert('联系人不存在');
    return;
  }

  const bridgeName = contact.bridgeName;
  const author = contact.displayName || contact.name || bridgeName;

  const authorAvatar =
    getContactAvatarById(contact.id);

  const postId = 'f' + Date.now();
  const timeStr = getNowTime();

  feedPosts.unshift({
    id: postId,
    authorId: contact.id,
    author,
    authorAvatar,
    bridgeName,
    content: '正在发布中...',
    time: timeStr,
    images: [],
    likes: [],
    comments: []
  });

  saveAll();
  renderFeedList();
  closeDialog('aiFeedPostDialog');

  _selectedAiFeedBridge = '';
  _selectedAiFeedContactId = '';

  if (VV_BRIDGE_CONFIG.enabled) {
    const cmd = VV_BRIDGE_CONFIG.buildFeedEventCommand({
      postId,
      content: '',
      images: [],
      author,
      bridgeName,
      isAiPost: true
    });

    try {
      await triggerSlash(cmd, {
        feedMode: true,
        feedMeta: {
          postId,
          author,
          authorId: contact.id,
          bridgeName,
          time: timeStr,
          content: '',
          images: [],
          photoDesc: '',
          location: '',
          isAiPost: true
        }
      });
    } catch (err) {
      console.error('[VV][FEED] AI feed post triggerSlash error:', err);
    }
  }
}

async function openChat(id, type = 'direct') {
  currentChatId = id;
  currentChatType = type;

  rememberCurrentChatSession();

  const list = type === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === id);
  if (!item) return;

  const title = document.getElementById('chatDetailName');
  const a = document.getElementById('contactPage');
  const b = document.getElementById('chatDetailPage');

  // 优先显示备注名
  const showName = item.displayName || item.name || item.bridgeName || '联系人';
  if (title) title.innerText = showName;
  if (a) a.style.display = 'none';
  if (b) b.style.display = 'block';

  clearComposerDraft();
  await applyCurrentChatBackground();
  await renderMessages();
  renderChatList?.();

  // 初始化长按改备注
  initChatTitleLongPress();
}

async function applyCurrentChatBackground() {
  const bg = getChatBackground(currentChatId) || '';
  const layer = document.getElementById('chatBackgroundLayer');
  if (!layer) return;

  if (bg) {
    const finalBg = await resolveImageRefToUrl(bg);
    layer.style.backgroundImage = `url(${finalBg})`;
    layer.style.backgroundColor = 'transparent';
  } else {
    layer.style.backgroundImage = 'none';
    layer.style.backgroundColor = '#f0f0f0';
  }
}

async function openChatDetail(chatId, forceName = '') {
  if (!chatId) return;

  if (!messages[chatId]) {
    messages[chatId] = [];
  }

  currentChatId = chatId;
  currentChatType = 'direct';

  rememberCurrentChatSession();

  let contact = contactList.find(i => i.id === chatId);

  if (!contact) {
    contact = {
      id: chatId,
      name: forceName || '联系人',
      bridgeName: forceName || '',
      avatar: DEFAULT_AVATAR,
      isSticky: false,
      lastTime: getNowTime(),
      lastPreview: '',
      threadType: 'direct'
    };
    contactList.unshift(contact);
  } else {
    if (forceName && (!contact.name || contact.name === '联系人')) {
      contact.name = forceName;
    }
    if (forceName && !contact.bridgeName) {
      contact.bridgeName = forceName;
    }
  }

  const rel = getRelSetting(chatId);
  if (forceName && !rel.name) {
    rel.name = forceName;
  }

  const setting = getChatSetting(chatId);
  if (!setting.theirAvatar) {
    setting.theirAvatar = DEFAULT_AVATAR;
  }
  if (typeof setting.myAvatarBase === 'undefined') {
    setting.myAvatarBase = '';
  }
  if (typeof setting.myAvatarOverride === 'undefined') {
    setting.myAvatarOverride = '';
  }
  if (typeof setting.backgroundBase === 'undefined') {
    setting.backgroundBase = '';
  }
  if (typeof setting.backgroundOverride === 'undefined') {
    setting.backgroundOverride = '';
  }

  const titleEl = document.getElementById('chatDetailName');
  if (titleEl) {
    titleEl.textContent = forceName || contact.name || rel.name || '联系人';
  }

  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
  });

  const page = document.getElementById('chatDetailPage');
  if (page) {
    page.style.display = 'block';
  }

  renderComposerPreview();

  if (typeof applyCurrentChatBackground === 'function') {
    await applyCurrentChatBackground();
  }

  if (typeof renderMessages === 'function') {
    await renderMessages();
    applyBubbleToChat(chatId);

    setTimeout(() => {
      if (currentChatId === chatId && typeof renderMessages === 'function') {
        renderMessages();
        applyBubbleToChat(chatId);
      }
      if (typeof flushPendingVVChatSyncQueue === 'function') {
        flushPendingVVChatSyncQueue();
      }
    }, 60);

    setTimeout(() => {
      if (currentChatId === chatId && typeof renderMessages === 'function') {
        renderMessages();
        applyBubbleToChat(chatId);
      }
      if (typeof flushPendingVVChatSyncQueue === 'function') {
        flushPendingVVChatSyncQueue();
      }
    }, 180);
  } else {
    if (typeof flushPendingVVChatSyncQueue === 'function') {
      setTimeout(() => {
        flushPendingVVChatSyncQueue();
      }, 60);

      setTimeout(() => {
        flushPendingVVChatSyncQueue();
      }, 180);
    }
  }

  if (typeof renderChatList === 'function') {
    renderChatList();
  } else if (typeof renderAllPanels === 'function') {
    renderAllPanels();
  }

  saveAll();
}

async function restoreLastChatSession() {
  const lastChatId = localStorage.getItem('st_current_chat_id') || '';
  const lastChatType = localStorage.getItem('st_current_chat_type') || 'direct';

  if (!lastChatId) return false;

  if (lastChatType === 'direct') {
    await openChatDetail(lastChatId);
    return true;
  }

  await openChat(lastChatId, lastChatType);
  return true;
}

function rememberCurrentChatSession() {
  try {
    localStorage.removeItem('st_current_chat_id');
    localStorage.removeItem('st_current_chat_type');
    console.log('[Session] remember blocked and cleared');
  } catch (err) {
    console.warn('[Session] rememberCurrentChatSession failed:', err);
  }
}

function removeComposerAttachment(index) {
  if (!composerDraft.attachments || index < 0) return;
  composerDraft.attachments.splice(index, 1);
  renderComposerPreview();
}

function getTransferStatusClass(status) {
  switch (status) {
    case '待收款':
      return 'transfer-card pending';
    case '已收款':
    case '已被接收':
      return 'transfer-card success';
    case '已退回':
      return 'transfer-card returned';
    default:
      return 'transfer-card pending';
  }
}

function getTransferStatusText(status) {
  switch (status) {
    case '待收款':
      return '待收款';
    case '已收款':
      return '✓ 已收款';
    case '已被接收':
      return '✓ 已被接收';
    case '已退回':
      return '已退回';
    default:
      return status || '待收款';
  }
}

function getTransferIconText(status) {
  switch (status) {
    case '已收款':
    case '已被接收':
      return '✓';
    case '已退回':
      return '↩';
    default:
      return '¥';
  }
}

function renderTransferMessage(m) {
  const cls = getTransferStatusClass(m.status);
  const amount = Number(m.amount || 0);
  const note = m.note || '转账';
  const statusText = getTransferStatusText(m.status);
  const icon = getTransferIconText(m.status);

  return `
    <div class="${cls}" onclick="openTransferReceiveDialog('${m.id}')">
      <div class="transfer-card-top">
        <div class="transfer-icon">${icon}</div>
        <div class="transfer-text">
          <div class="transfer-amount">¥${escapeHTML(String(amount))}</div>
          <div class="transfer-note">${escapeHTML(note)}</div>
        </div>
      </div>
      <div class="transfer-card-bottom">${escapeHTML(statusText)}</div>
    </div>
  `;
}

function renderTransferNoticeMessage(m) {
  const cls = getTransferStatusClass(m.status);
  const amount = Number(m.amount || 0);
  const note = m.note || '转账';
  const statusText = getTransferStatusText(m.status);
  const icon = getTransferIconText(m.status);

  return `
    <div class="${cls}">
      <div class="transfer-card-top">
        <div class="transfer-icon">${icon}</div>
        <div class="transfer-text">
          <div class="transfer-amount">¥${escapeHTML(String(amount))}</div>
          <div class="transfer-note">${escapeHTML(note)}</div>
        </div>
      </div>
      <div class="transfer-card-bottom">${escapeHTML(statusText)}</div>
    </div>
  `;
}

function renderMessageOriginal(m) {
  if (m.type === 'transfer') {
    return renderTransferMessage(m);
  }

  if (m.type === 'transfer_notice') {
    return renderTransferNoticeMessage(m);
  }

  if (m.type === 'call-record') {
    return renderCallRecordMessage(m);
  }

  switch (m.type) {
    case 'text': {
      const chunks = Array.isArray(m.chunks) && m.chunks.length
        ? m.chunks
        : (typeof m.text === 'string' && m.text.trim()
            ? [m.text]
            : []);
      return chunks.map(chunk => `<div class="message-bubble">${escapeHTML(chunk)}</div>`).join('');
    }

    case 'sticker':
      return `<div class="message-bubble sticker-bubble"><img ${buildMediaSrcAttrs(m.src)} alt="${escapeHTML(m.stickerName || '表情')}"></div>`;

    case 'image':
      return `
        <div class="message-bubble image-bubble">
          <img ${buildMediaSrcAttrs(m.src)} alt="">
        </div>`;

    case 'voice':
      return `
        <div class="message-bubble voice-bubble">
          <div class="voice-main">
            <div class="voice-icon">🎤</div>
            <div>${escapeHTML(m.duration || 4)}'' 语音</div>
          </div>
          <div class="voice-text">转文字：${escapeHTML(m.transcript || '')}</div>
        </div>`;

    case 'system':
      return (m.chunks || []).map(chunk => `<div class="message-bubble">${escapeHTML(chunk)}</div>`).join('');

    default:
      return `<div class="message-bubble">未知消息</div>`;
  }
}

async function renderMessages() {
  console.log('[renderMessages] start currentChatId =', currentChatId);

  const area = document.getElementById('messageArea');
  if (!area) {
    console.log('[renderMessages] messageArea not found');
    return;
  }

  const msgs = messages[currentChatId] || [];
  console.log('[renderMessages] msgs =', msgs);

  if (!msgs.length) {
    area.innerHTML = '<div style="text-align:center;color:#999;padding:20px;">开始聊天吧~</div>';
    return;
  }

  const setting = normalizeChatSetting(currentChatId);
  let html = '';
  let lastLabel = '';

  msgs.forEach(m => {
    const label = m.timeLabel || '';
    if (label && !isSameTimeDivider(label, lastLabel)) {
      html += `<div class="time-divider">${escapeHTML(label)}</div>`;
      lastLabel = label;
    }

    const avatarSrc = m.isMe
      ? getMyAvatar(currentChatId)
      : (setting.theirAvatar || DEFAULT_AVATAR);

    console.log('[renderMessages] avatarSrc =', avatarSrc, 'isMe=', m.isMe);

    const avatar = `<div class="message-avatar"><img ${buildMediaSrcAttrs(avatarSrc)} alt=""></div>`;

    const senderName = (!m.isMe && currentChatType === 'group')
      ? `<div class="message-sender">${escapeHTML(m.senderName || '')}</div>`
      : '';

    const quote = m.replyTo ? `
      <div class="quote-box">
        <strong>${escapeHTML(m.replyTo.senderName || '消息')}</strong><br>
        ${escapeHTML(m.replyTo.preview || '')}
      </div>` : '';

    let bodyHTML = '';

    if (m.recalled) {
      bodyHTML = `
        <div class="recalled-tip" onclick="toggleHiddenOriginal('${m.id}')">
          ${m.isMe ? '你' : escapeHTML(m.senderName || '对方')}撤回了一条消息
        </div>
        <div class="hidden-original" id="hidden-${m.id}">
          ${renderMessageOriginal(m)}
        </div>`;
    } else {
      bodyHTML = renderMessageOriginal(m);
    }

    html += `
      <div class="message-row ${m.isMe ? 'me' : ''}" data-mid="${m.id}" oncontextmenu="showMessageMenu(event,'${m.id}')">
        <div class="message-group">
          ${avatar}
          <div class="message-stack">
            ${senderName}
            ${quote}
            ${bodyHTML}
          </div>
        </div>
      </div>
    `;
  });

  area.innerHTML = html;
  console.log('[renderMessages] final html =', area.innerHTML);
  console.log('[renderMessages] html injected');

  await hydrateMediaRefs(area);
  console.log('[renderMessages] hydrate done');
  // 应用气泡样式
  if (typeof applyBubbleToChat === 'function') {
    applyBubbleToChat(currentChatId);
  }

  const toolbar = document.querySelector('.input-toolbar');
  if (toolbar) {
    area.style.bottom = toolbar.offsetHeight + 'px';
  }

  area.scrollTop = area.scrollHeight;
}

function toggleHiddenOriginal(mid) {
  const el = document.getElementById('hidden-' + mid);
  if (!el) return;
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function clearComposerDraft() {
  composerDraft = {
    quote: null,
    attachments: []
  };
  renderComposerPreview();
}

function clearComposerQuote() {
  composerDraft.quote = null;
  renderComposerPreview();
}

function renderComposerPreview() {
  const quoteBox = document.getElementById('composerQuotePreview');
  const quoteText = document.getElementById('composerQuoteText');
  const attachBox = document.getElementById('composerAttachments');
  if (!quoteBox || !quoteText || !attachBox) return;

  if (composerDraft.quote) {
    quoteBox.style.display = 'flex';
    quoteText.innerHTML = `引用 <strong>${escapeHTML(composerDraft.quote.senderName)}</strong>：${escapeHTML(composerDraft.quote.preview)}`;
  } else {
    quoteBox.style.display = 'none';
  }

  if (composerDraft.attachments.length) {
    attachBox.style.display = 'flex';
    attachBox.innerHTML = composerDraft.attachments.map((att, idx) => {
      if (att.type === 'sticker') {
        return `<div class="attach-chip"><img ${buildMediaSrcAttrs(att.src)} alt=""><div class="attach-chip-text">表情：${escapeHTML(att.stickerName)}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      if (att.type === 'image') {
        return `<div class="attach-chip"><img ${buildMediaSrcAttrs(att.src)} alt=""><div class="attach-chip-text">图片：${escapeHTML(att.desc || '未填写描述')}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      if (att.type === 'voice') {
        return `<div class="attach-chip"><div class="attach-chip-text">语音：${escapeHTML(att.transcript || '')}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      if (att.type === 'transfer') {
        return `<div class="attach-chip"><div class="attach-chip-text">转账：¥${escapeHTML(att.amount)} ${escapeHTML(att.note || '')}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      return '';
    }).join('');

    hydrateMediaRefs(attachBox);
  } else {
    attachBox.style.display = 'none';
    attachBox.innerHTML = '';
  }
}

function exitStickerManageMode() {
  stickerManageMode = false;
  stickerRenameId = null;
  stickerRenameDraft = '';
  clearTimeout(stickerPressTimer);
  renderEmojiPanel();
}

function handleStickerTouchStart(stickerId) {
  clearTimeout(stickerPressTimer);
  stickerPressTimer = setTimeout(() => {
    enterStickerManageMode(stickerId);
  }, 450);
}

function enterStickerManageMode(stickerId = null) {
  stickerManageMode = true;
  stickerRenameId = stickerId;
  stickerRenameDraft = '';

  const sticker = stickerPacks.find(s => s.id === stickerId);
  if (sticker) {
    stickerRenameDraft = sticker.name || '表情';
  }

  renderEmojiPanel();

  requestAnimationFrame(() => {
    if (!stickerId) return;
    const input = document.querySelector(`.sticker-rename-input[data-sticker-id="${stickerId}"]`);
    input?.focus();
    input?.select();
  });
}

function handleStickerTouchEnd() {
  clearTimeout(stickerPressTimer);
}

function deleteStickerById(stickerId, e) {

  e?.preventDefault?.();
  e?.stopPropagation?.();

  const index = stickerPacks.findIndex(s => s.id === stickerId);
  if (index === -1) return;

  const ok = confirm('确定删除这个表情吗？');
  if (!ok) return;

  stickerPacks.splice(index, 1);
  saveAll();
  renderEmojiPanel();
}

function saveStickerRename(stickerId, value) {
  const sticker = stickerPacks.find(s => s.id === stickerId);
  if (!sticker) return;

  const name = (value || '').trim() || '表情';
  sticker.name = name;

  saveAll();
  renderEmojiPanel();

  requestAnimationFrame(() => {
    const input = document.querySelector(`.sticker-rename-input[data-sticker-id="${stickerId}"]`);
    input?.focus();
    input?.select();
  });
}

function handleStickerRenameKeydown(event, stickerId) {
  event.stopPropagation();

  if (event.key === 'Enter') {
    event.preventDefault();
    saveStickerRename(stickerId, event.target.value);
    event.target.blur();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    const sticker = stickerPacks.find(s => s.id === stickerId);
    if (sticker) {
      event.target.value = sticker.name || '表情';
    }
    event.target.blur();
  }
}

function removeDraftAttachment(index) {
  composerDraft.attachments.splice(index, 1);
  renderComposerPreview();
}

function getAttachmentSummary(att) {
  if (!att) return '消息';
  if (att.type === 'sticker') return `[表情] ${att.stickerName || '表情'}`;
  if (att.type === 'image') return `[图片]${att.desc ? ' ' + att.desc : ''}`;
  if (att.type === 'voice') return `[语音] ${att.transcript || ''}`;
  if (att.type === 'transfer') return `[转账] ¥${att.amount}`;
  return '消息';
}

function updateLastMsg(id, lastText, time, type = currentChatType) {
  const list = type === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === id);
  if (item) {
    item.lastTime = time || item.lastTime;
    item.lastPreview = lastText || item.lastPreview || '';
  }
  saveAll();
  renderAllPanels();
}

function collectRefsFromMessage(msg) {
  const refs = [];
  if (msg && isIDBRef(msg.src)) refs.push(msg.src);
  return refs;
}

function removeRefsPossiblyUnused(refs) {
  if (!refs || !refs.length) return;
  setTimeout(() => {
    cleanupUnusedIDBAssets();
  }, 0);
}

async function sendMessage() {
  if (!currentChatId) return;
  console.log('[sendMessage] currentChatId =', currentChatId);
  console.log('[sendMessage] before push thread =', messages[currentChatId]);

  const rel = getRelSetting(currentChatId);
  if (rel.blockedByMe) {
    alert('你已拉黑该联系人，无法发送消息');
    return;
  }
  if (rel.blockedByThem) {
    alert('对方已拉黑你，消息将被拒收');
    return;
  }

  const input = document.getElementById('chatInput');
  if (!input) return;

  const rawText = input.value.trim();
  const chunks = splitInputToChunks(rawText);
  const hasText = chunks.length > 0;
  const attachments = [...composerDraft.attachments];
  const hasAnything = hasText || attachments.length || composerDraft.quote;

  if (!hasAnything) return;

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  if (hasText) {
    messages[currentChatId].push({
      id: 'm' + Date.now() + '_t',
      sender: 'me',
      senderName: '我',
      isMe: true,
      type: 'text',
      chunks,
      replyTo: composerDraft.quote ? { ...composerDraft.quote } : null,
      recalled: false,
      time,
      timeLabel,
      pendingForReply: true
    });
  }

  console.log('[sendMessage] after text push thread =', messages[currentChatId]);

  attachments.forEach((att, idx) => {
    messages[currentChatId].push({
      id: 'm' + Date.now() + '_' + idx,
      sender: 'me',
      senderName: '我',
      isMe: true,
      type: att.type,
      src: att.src || '',
      stickerName: att.stickerName || '',
      desc: att.desc || '',
      transcript: att.transcript || '',
      duration: att.duration || 4,
      amount: att.amount || '',
      note: att.note || '',
      status: att.status || '',
      replyTo: (!hasText && idx === 0 && composerDraft.quote) ? { ...composerDraft.quote } : null,
      recalled: false,
      time,
      timeLabel,
      pendingForReply: true
    });
  });

  console.log('[sendMessage] after all push thread =', messages[currentChatId]);

  const lastContent = hasText ? chunks[chunks.length - 1] : getAttachmentSummary(attachments[attachments.length - 1]);
  updateLastMsg(currentChatId, lastContent, time, currentChatType);

  pendingReplyTargets[currentChatId] = true;
  console.log('pendingReplyTargets set true:', currentChatId, pendingReplyTargets[currentChatId]);

  input.value = '';
  clearComposerDraft();
  await renderMessages();
  applyBubbleToChat(currentChatId);
  saveAll();
  closeEmojiPanel();
}

function getLatestPendingOutgoingMessages(list) {
  if (!Array.isArray(list) || !list.length) return [];

  const result = [];

  for (let i = list.length - 1; i >= 0; i--) {
    const m = list[i];
    if (!m || m.recalled) continue;

    if (m.isMe && m.pendingForReply) {
      result.unshift(m);
      continue;
    }

    // 一旦尾部连续块被打断，就停止
    if (result.length > 0) {
      break;
    }

    // 尾部不是 pending 的我方消息，说明当前没有新一轮输入
    break;
  }

  return result;
}

function buildVVEventPayload(chatId) {
  const list = messages[chatId] || [];
  const myPendings = getLatestPendingOutgoingMessages(list);

  if (!myPendings.length) return '';

  const chatSetting = getChatSetting(chatId) || {};
  const rel = getRelSetting(chatId) || {};
  const time = typeof getNowFullLabel === 'function' ? getNowFullLabel() : getNowTime();
  const contact = contactList.find(c => c.id === chatId) || {};
  const targetName = contact.displayName || contact.name || rel.name || chatSetting.name || getBridgeNameByChatId(chatId, currentChatType) || '未知联系人';

  function toMessageText(m) {
    if (!m) return '[消息]';
    if (m.type === 'text') return (m.chunks || []).join('\n');
    if (m.type === 'sticker') return `[表情] ${m.stickerName || '表情'}`;
    if (m.type === 'image') return `[图片] ${m.desc || ''}`.trim();
    if (m.type === 'voice') return `[语音] ${m.transcript || ''}`.trim();
    if (m.type === 'transfer') return `[转账] 金额${m.amount}，备注${m.note || '无'}`;
    if (m.type === 'system') return `[系统] ${(m.chunks || []).join(' / ')}`;
    return '[消息]';
  }

  const pendingTexts = myPendings.map(toMessageText);

  console.log('[VV_EVENT] selected latest pendings =', myPendings);
  console.log('[VV_EVENT] pendingTexts =', pendingTexts);

  const myAvatarKey = 'current_my_avatar';
  const targetAvatarId = chatSetting.theirAvatar ? String(chatSetting.theirAvatar) : 'contact_unknown_avatar';
  const myBubble = chatSetting.myBubble || '#5B86FF';
  const targetBubble = chatSetting.targetBubble || '#F8F8F8';
  const chatBgKey = 'current_chat_bg';

  const lines = [
    '以下是一次手机聊天事件。',
    '不要复述事件字段，不要解释字段内容，不要引用字段名。',
    '⚠️ 例外：如果系统注入了 id=vv_feed 的指令，说明这是朋友圈动态事件，此时禁止输出 [VV_CHAT_SYNC]，必须且只能输出 [VV_FEED_SYNC] 块。',
    '如果角色继续回复线上消息，且当前不是朋友圈动态事件（无 vv_feed 注入），你必须只输出一个完整的 [VV_CHAT_SYNC] ... [/VV_CHAT_SYNC] 块。',
    '不要输出 [聊天界面]。',
    '[VV_CHAT_SYNC] 只用于前端同步，只包含本轮新增消息，不要重复历史消息。',
    '[VV_CHAT_SYNC] 中的 chatId 和 target 必须与 [VV_EVENT] 中的完全一致，不得自行替换为其他名称或ID。',
    '如果事件中存在 messageCount 和 message1、message2、message3... 字段，你必须按编号顺序逐条展开成 side=right 的 [消息] 块，不可合并，不可省略。',
    '如果事件中只有单个 message 字段，则只展开这一条用户消息。',
    '然后再输出角色自己的 side=left 的 [消息] 回复块。',
    '必须保留以下字段：chatId、target、time、myAvatarKey、targetAvatarId、myBubble、targetBubble、chatBgKey。',
    'time 只在顶部显示一次，消息块内部不要重复输出 time。',
    '用户消息必须使用 side=right，角色消息必须使用 side=left。',
    '每条消息都要单独成块。',
    '所有 [消息] 块必须显式包含以下字段：side、sender、content、state。',
    '不得使用 text 代替 content。',
    '不得省略 sender=。',
    '不得省略 state=。',
    '如果用户消息中包含"[转账]"，角色回复时必须在 [消息] 块中添加 transferAction=accept 或 transferAction=return 字段。',
    '角色语义表示收到、接受、收下时写 transferAction=accept。',
    '角色语义表示拒绝、退回、不收时写 transferAction=return。',
    '角色主动转账时写 transferAction=send 和 transferAmount=金额。',
    'transferAction 字段写在 [消息] 块内，与 side、sender、content、state 同级。',
    '',
    '[VV_EVENT]',
    'type=chat',
    'chatId=' + chatId,
    'target=' + targetName,
    'time=' + time,
    'messageCount=' + pendingTexts.length
  ];

  pendingTexts.forEach((text, index) => {
    lines.push(`message${index + 1}=` + String(text || '').replace(/\n/g, '\\n'));
  });

  lines.push(
    'myAvatarKey=' + myAvatarKey,
    'targetAvatarId=' + targetAvatarId,
    'myBubble=' + myBubble,
    'targetBubble=' + targetBubble,
    'chatBgKey=' + chatBgKey,
    '[/VV_EVENT]'
  );

  return lines.join('\n');
}

// ============================================================
// 电话功能 - 构建通话事件payload
// ============================================================

function buildVVCallEventPayload(contactId, callPhase, userMessage) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return '';

  const targetName = contact.bridgeName || contact.name || '角色';
  const time = typeof getNowFullLabel === 'function' ? getNowFullLabel() : getNowTime();
  const chatSetting = getChatSetting(contactId) || {};

  const lines = [
    '你现在正在和用户打电话。像真人打电话一样自然对话。',
    '严格按照下面的格式输出，不要输出任何多余内容（不要解释、不要旁白、不要OOC）。',
    ''
  ];

  if (callPhase === 'calling') {
    lines.push(
      '用户正在拨打电话给你（' + targetName + '）。',
      '根据当前剧情和你与用户的关系决定：接听、拒接或不接（无人接听）。',
      '接听→callPhase=accept，并说一句接电话的话。',
      '拒接→callPhase=reject。',
      '无人接听→callPhase=miss。',
      ''
    );
  } else if (callPhase === 'talking') {
    lines.push(
      '你们正在通话中，用户刚刚说了以下内容：'
    );

    if (userMessage) {
      const userLines = userMessage.split('\n').filter(l => l.trim());
      userLines.forEach(function(line) {
        lines.push('「' + line.trim() + '」');
      });
    }

    lines.push(
      '',
      '请自然地回复，就像真的在打电话一样。',
      '可以输出1到3个 [通话] 块（代表你说的1到3句话）。callPhase=reply',
      ''
    );

    // 附上最近的通话记录作为上下文
    const recentLogs = (callLogs[contactId] || []).slice(-10);
    if (recentLogs.length > 0) {
      lines.push('之前的通话记录（供你参考上下文）：');
      recentLogs.forEach(log => {
        lines.push((log.isMe ? '用户' : log.speaker) + '：' + log.text);
      });
      lines.push('');
    }
  } else if (callPhase === 'incoming') {
    lines.push(
      '你主动给用户打了电话，用户已经接听。',
      '请说一句打电话过来的开场白，要符合你当前的心情和剧情。',
      'callPhase=reply。',
      ''
    );
  }

  lines.push(
    '[VV_EVENT]',
    'type=call',
    'chatId=' + contactId,
    'target=' + targetName,
    'callPhase=' + callPhase,
    'time=' + time,
    'myAvatarKey=current_my_avatar',
    'targetAvatarId=' + (chatSetting.theirAvatar || 'contact_unknown_avatar'),
    '[/VV_EVENT]',
    ''
  );

  // 格式模板 — 给AI一个填空式的明确示例
  lines.push(
    '严格按此格式输出（不要加任何其他文字）：',
    '',
    '[VV_CALL_SYNC]',
    'chatId=' + contactId,
    'target=' + targetName,
    'callPhase=（填写accept/reject/miss/reply其中一个）',
    'time=' + time,
    '',
    '[通话]',
    'speaker=' + targetName,
    'content=（你说的话）',
    '',
    '[/VV_CALL_SYNC]'
  );

  return lines.join('\n');
}

function buildVVFeedEventPayload(postId, content, images, author) {
  const time = typeof getNowFullLabel === 'function' ? getNowFullLabel() : getNowTime();
  const imageNote = images && images.length ? '\n附图数量:' + images.length + '张' : '';

  const lines = [
    '【系统指令·朋友圈动态·严格遵守】',
    '',
    '⚠️ 这是一条朋友圈动态事件。',
    '⚠️ 这不是电话。这不是私聊。这不是通话。',
    '⚠️ 禁止输出 [VV_CALL_SYNC]。',
    '⚠️ 禁止输出 [VV_CHAT_SYNC]。',
    '⚠️ 禁止输出 [VV_INCOMING_CALL]。',
    '⚠️ 禁止输出 callPhase。',
    '⚠️ 禁止输出 [通话] 块。',
    '⚠️ 禁止输出任何解释、旁白、正文叙事。',
    '⚠️ 禁止模拟用户（维夏/"我"）的回复，你只能模拟其他角色的互动',
    '',
    '你必须且只能输出一个 [VV_FEED_SYNC] 块，格式如下：',
    '',
    '[VV_FEED_SYNC]',
    'postId=动态ID',
    'time=时间',
    '',
    '[互动]',
    'from=角色名',
    'action=like或comment',
    'content=评论内容（仅action=comment时需要）',
    '[/互动]',
    '',
    '[/VV_FEED_SYNC]',
    '',
    '规则：',
    '- action 只有两个值：like 或 comment',
    '- comment 必须有 content 字段，like 不需要',
    '- from 必须是角色卡或世界书中存在的角色名，不能是"我"或"用户"',
    '- 根据角色性格自然决定是否互动，不强制每个角色都出现',
    '- 同一角色不要重复出现多次',
    '- postId 必须与下方一致',
    '',
    '═══════════════════════════',
    '用户发布的动态内容：',
    '发布者：' + author,
    '时间：' + time,
    '内容：' + content + imageNote,
    'postId=' + postId,
    '═══════════════════════════',
    '',
    '现在请直接输出 [VV_FEED_SYNC] 块，不要输出任何其他内容：'
  ];

  return lines.join('\n');
}

function buildVVFeedAiPostPayload(postId, author, bridgeName) {
  return `【系统指令·AI角色发布朋友圈动态·严格遵守】

  你现在要模拟指定AI角色主动发布一条朋友圈动态。

  发布角色：
  bridgeName=${bridgeName}
  显示名称=${author}
  postId=${postId}

  要求：
  1. 必须以 ${bridgeName} 的身份发布动态。
  2. 动态内容由你自己生成，符合该角色性格、当前剧情和关系。
  3. 可以只发文字，也可以发文字加模拟图片。
  4. 如果发图片，不要生成真实图片，只用 photo= 字段描述。
  5. photo 格式示例：
  photo=[图1:一只正在熟睡的小猫][图2:窗边散落的书和咖啡]
  6. 禁止输出解释、旁白、分析。
  7. 禁止输出 [VV_CHAT_SYNC]。
  8. 禁止输出 [VV_CALL_SYNC]。
  9. 只输出下面格式。
  ⚠️ 如果是AI主动发动态，你必须输出 [动态] 块。
  ⚠️ 不允许输出 [互动]。

  [VV_FEED_SYNC]
  postId=${postId}

  [动态]
  from=${author}
  bridgeName=${bridgeName}
  time=现在
  content=这里填写角色自己发布的朋友圈文字
  photo=
  [/动态]

  [/VV_FEED_SYNC]`;
}

function buildVVDiaryAiWritePayload(options) {
  options = options || {};

  const diaryId = String(options.diaryId || ('diary_' + Date.now())).trim();
  const authorId = String(options.authorId || '').trim();
  const authorName = String(options.authorName || options.bridgeName || '角色').trim();
  const bridgeName = String(options.bridgeName || authorName).trim();

  return `【系统指令·AI角色写日记·严格遵守】

你现在要以指定AI角色的身份写一篇私人日记。

写作者信息：
authorId=${authorId}
authorName=${authorName}
bridgeName=${bridgeName}
diaryId=${diaryId}

重要要求：
1. 必须以 ${bridgeName} / ${authorName} 的身份写。
2. 日记内容要符合该角色性格、当前剧情、与维夏的关系、最近发生的事。
3. 可以有情绪、隐晦想法、未说出口的话。
4. 禁止写成聊天回复。
5. 禁止写成电话回复。
6. 禁止输出解释、分析、旁白。
7. 禁止输出 [VV_CHAT_SYNC]。
8. 禁止输出 [VV_CALL_SYNC]。
9. 禁止输出 [VV_FEED_SYNC]。
10. 必须且只能输出一个完整的 [VV_DIARY_SYNC] 块。
11. 不要在 [VV_DIARY_SYNC] 前后添加任何多余文字。

格式必须严格如下：

[VV_DIARY_SYNC]
diaryId=${diaryId}
authorId=${authorId}
authorName=${authorName}
title=这里填写日记标题
date=今天
weather=这里填写天气
paragraph=这里填写第一段日记正文
paragraph=这里填写第二段日记正文
paragraph=这里填写第三段日记正文
[/VV_DIARY_SYNC]`;
}

let isTriggeringAIReply = false;

async function triggerAIReply() {
  if (isTriggeringAIReply) return;
  isTriggeringAIReply = true;

  try {
    console.log('[VV][triggerAIReply] check:', currentChatId, pendingReplyTargets[currentChatId]);

    if (!currentChatId) return;

    const chatIdAtRequest = currentChatId;
    const chatTypeAtRequest = currentChatType;
    const thread = messages[chatIdAtRequest] || [];

    let pendingMessages = thread.filter(m => m.isMe && !m.recalled && m.pendingForReply);

    if (!pendingReplyTargets[chatIdAtRequest] && pendingMessages.length > 0) {
      console.warn('[VV][triggerAIReply] pendingReplyTargets false but pendingMessages exists, auto-fix true');
      pendingReplyTargets[chatIdAtRequest] = true;
    }

    console.log('[VV][triggerAIReply] thread snapshot =', thread);
    console.log('[VV][triggerAIReply] pendingMessages =', pendingMessages);
    console.log('[VV][triggerAIReply] pending flag after auto-fix =', pendingReplyTargets[chatIdAtRequest]);

    if (!pendingReplyTargets[chatIdAtRequest]) {
      console.log('[VV][triggerAIReply] skip: pendingReplyTargets false');
      return;
    }

    pendingMessages = thread.filter(m => m.isMe && !m.recalled && m.pendingForReply);

    if (!pendingMessages.length) {
      console.warn('[VV][triggerAIReply] no pendingMessages, clear pending flag');
      pendingReplyTargets[chatIdAtRequest] = false;
      saveAll();
      return;
    }

    const beforeLeftCount = thread.filter(m => !m.isMe && !m.recalled).length;
    console.log('[VV][triggerAIReply] beforeLeftCount =', beforeLeftCount);

    const bridgeName = getBridgeNameByChatId(chatIdAtRequest, chatTypeAtRequest);
    const promptText = buildVVEventPayload(chatIdAtRequest) || buildLatestUserPayload(chatIdAtRequest);

    console.log('[VV][triggerAIReply] bridgeName =', bridgeName);
    console.log('[VV][triggerAIReply] promptText >>>');
    console.log(promptText);
    console.log('<<< [VV][triggerAIReply] promptText');

    let slashOk = false;

    if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.chatMode === 'slash' || VV_BRIDGE_CONFIG.chatMode === 'local+slash')) {
      const cmd = VV_BRIDGE_CONFIG.buildReplyCommand({
        bridgeName,
        chatId: chatIdAtRequest,
        chatType: chatTypeAtRequest,
        promptText
      });

      console.log('[VV][triggerAIReply] cmd >>>');
      console.log(cmd);
      console.log('<<< [VV][triggerAIReply] cmd');

      slashOk = await triggerSlash(cmd);
      console.log('[VV][triggerAIReply] slashOk =', slashOk);
    }

    if (slashOk) {
      console.log('[triggerAIReply] slash submitted, waiting for VVPHONE_CHAT_SYNC...');

      setTimeout(() => {
        const latestThread = messages[chatIdAtRequest] || [];
        const leftCountNow = latestThread.filter(m => !m.isMe && !m.recalled).length;
        const hasNewLeftReply = leftCountNow > beforeLeftCount;

        console.log('[VV][fallback-check][800]', {
          chatIdAtRequest,
          beforeLeftCount,
          leftCountNow,
          hasNewLeftReply,
          latestThread
        });

        if (!hasNewLeftReply) {
          console.warn('[VV] no new left reply after slash ok, try resend last sync');
          requestResendLastVVChatSync(chatIdAtRequest);
        }
      }, 800);

      setTimeout(() => {
        const latestThread = messages[chatIdAtRequest] || [];
        const leftCountNow = latestThread.filter(m => !m.isMe && !m.recalled).length;
        const hasNewLeftReply = leftCountNow > beforeLeftCount;

        console.log('[VV][fallback-check][1600]', {
          chatIdAtRequest,
          beforeLeftCount,
          leftCountNow,
          hasNewLeftReply,
          latestThread
        });

        if (!hasNewLeftReply) {
          console.warn('[VV] still no new left reply, try resend last sync again');
          requestResendLastVVChatSync(chatIdAtRequest);
        }
      }, 1600);
    }

    if (!slashOk || VV_BRIDGE_CONFIG.chatMode === 'local') {
      console.warn('[VV][triggerAIReply] using local simulateAutoReply fallback', {
        slashOk,
        chatMode: VV_BRIDGE_CONFIG.chatMode
      });

      simulateAutoReply(chatIdAtRequest, chatTypeAtRequest);
      pendingMessages.forEach(m => {
        m.pendingForReply = false;
      });
      pendingReplyTargets[chatIdAtRequest] = false;
    }

    saveAll();
  } finally {
    setTimeout(() => {
      isTriggeringAIReply = false;
      console.log('[VV][triggerAIReply] unlock isTriggeringAIReply = false');
    }, 300);
  }
}

async function replyCurrentChat() {
  if (!currentChatId) {
    alert('当前没有打开会话');
    return;
  }

  const thread = messages[currentChatId] || [];
  const hasPending = thread.some(m => m.isMe && !m.recalled && m.pendingForReply);

  if (!hasPending) {
    alert('当前没有待回复的消息');
    return;
  }

  await triggerAIReply();
}

window.replyCurrentChat = replyCurrentChat;

function triggerAIReplySoon(delay) {
  const wait = typeof delay === 'number' ? delay : 60;

  setTimeout(() => {
    try {
      triggerAIReply?.();
    } catch (err) {
      console.error('[AI] triggerAIReplySoon error:', err);
    }
  }, wait);
}

function requestResendLastVVChatSync(chatId, viewId) {
  try {
    const finalViewId = viewId || window.__vv_view_id || '';

    window.parent.postMessage({
      type: 'VVPHONE_RESEND_LAST_CHAT_SYNC',
      chatId: chatId || '',
      viewId: finalViewId
    }, '*');

    console.log('[VV] requested resendLastChatSync by postMessage:', {
      chatId,
      viewId: finalViewId
    });

    return true;
  } catch (e) {
    console.warn('[VV] requestResendLastVVChatSync failed:', e);
    return false;
  }
}

function simulateAutoReply(targetId, type) {
  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  if (!messages[targetId]) messages[targetId] = [];

  const lastMine = [...messages[targetId]].reverse().find(m => m.isMe);
  let autoReply;

  if (type === 'group') {
    autoReply = {
      id: 'm' + Date.now(),
      sender: 'npc_' + Date.now(),
      senderName: '群友A',
      isMe: false,
      type: 'text',
      chunks: ['看到了，我先回一句。', '这个群终于热闹起来了。'],
      recalled: false,
      time,
      timeLabel
    };
  } else {
    let text = '我看到了你刚刚发来的消息。';
    if (lastMine?.type === 'transfer') {
      text = '我已经收下转账了。';
      lastMine.status = '已收款';
    }
    autoReply = {
      id: 'm' + Date.now(),
      sender: targetId,
      senderName: getCurrentChatName(targetId, type),
      isMe: false,
      type: 'text',
      chunks: [text],
      recalled: false,
      time,
      timeLabel
    };
  }

  messages[targetId].push(autoReply);
  renderMessages();
  updateLastMsg(targetId, autoReply.chunks?.slice(-1)[0] || '新消息', time, type);
  saveAll();
}

function findLastPendingMyTransfer(chatId) {
  const thread = messages[chatId] || [];
  for (let i = thread.length - 1; i >= 0; i--) {
    const msg = thread[i];
    if (msg && msg.isMe && msg.type === 'transfer' && msg.status === '待收款') {
      return msg;
    }
  }
  return null;
}

function acceptMyTransferByAI(chatId, transferMsg) {
  if (!chatId || !transferMsg) return;
  if (transferMsg.status !== '待收款') return;

  transferMsg.status = '已被接收';

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_accept',
    sender: chatId,
    senderName: getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type: 'transfer_notice',
    amount: Number(transferMsg.amount || 0),
    note: transferMsg.note || '转账',
    status: '已收款',
    relatedTransferId: transferMsg.id,
    recalled: false,
    time,
    timeLabel
  });

  updateLastMsg(chatId, `[收款] ¥${transferMsg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
}

function returnMyTransferByAI(chatId, transferMsg) {
  if (!chatId || !transferMsg) return;

  console.log('[AI退回前]', transferMsg.id, transferMsg.status);

  if (transferMsg.status !== '待收款') return;

  transferMsg.status = '已退回';
  console.log('[AI退回后]', transferMsg.id, transferMsg.status);

  if (!transferMsg.refunded) {
    addWalletBalance(Number(transferMsg.amount || 0));
    transferMsg.refunded = true;
  }

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_return',
    sender: chatId,
    senderName: getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type: 'transfer_notice',
    amount: Number(transferMsg.amount || 0),
    note: transferMsg.note || '转账',
    status: '已退回',
    relatedTransferId: transferMsg.id,
    recalled: false,
    time,
    timeLabel
  });

  updateLastMsg(chatId, `[退回转账] ¥${transferMsg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
}

function receiveTransferFromAI(chatId, amount, note = '给你的转账') {
  if (!chatId) return;

  const money = Number(amount || 0);
  if (!Number.isFinite(money) || money <= 0) return;

  if (!messages[chatId]) messages[chatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  const newMsg = {
    id: 'm' + Date.now() + '_ai_transfer',
    sender: chatId,
    senderName: getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type: 'transfer',
    amount: money,
    note,
    status: '待收款',
    recalled: false,
    time,
    timeLabel,
    settled: false,
    refunded: false
  };

  messages[chatId].push(newMsg);

  updateLastMsg(chatId, `[转账] ¥${money}`, time, currentChatType);
  renderMessages();
  saveAll();
}

function openTransferReceiveDialog(messageId) {
  if (!currentChatId || !messageId) return;

  const thread = messages[currentChatId] || [];
  const msg = thread.find(m => m.id === messageId);
  if (!msg || msg.type !== 'transfer') return;

  currentTransferMessageRef = msg;
  currentTransferChatId = currentChatId;

  const amountEl = document.getElementById('receiveTransferAmount');
  const noteEl = document.getElementById('receiveTransferNote');
  const actionEl = document.getElementById('receiveTransferActions');
  const stateEl = document.getElementById('receiveTransferState');

  if (amountEl) amountEl.textContent = `¥${Number(msg.amount || 0)}`;
  if (noteEl) noteEl.textContent = msg.note || '转账';

  const isPending = msg.status === '待收款';
  const canOperate = !msg.isMe && isPending;

  if (stateEl) {
    stateEl.textContent = isPending ? '待收款' : (msg.status || '');
  }

  if (actionEl) {
    actionEl.style.display = canOperate ? 'flex' : 'none';
  }

  showDialog('receiveTransferDialog');
}

function acceptIncomingTransfer() {
  const msg = currentTransferMessageRef;
  const chatId = currentTransferChatId;
  if (!msg || !chatId) return;

  if (msg.isMe) {
    closeDialog('receiveTransferDialog');
    return;
  }

  const thread = messages[chatId] || [];
  const idx = thread.findIndex(item => item.id === msg.id);
  if (idx === -1) {
    closeDialog('receiveTransferDialog');
    return;
  }

  const targetMsg = thread[idx];

  if (targetMsg.type !== 'transfer' || targetMsg.status !== '待收款') {
    closeDialog('receiveTransferDialog');
    return;
  }

  if (!targetMsg.settled) {
    addWalletBalance(Number(targetMsg.amount || 0));
    targetMsg.settled = true;
  }

  // 关键：直接回写到消息数组里
  messages[chatId][idx] = {
    ...targetMsg,
    status: '已收款'
  };

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_accepted_notice',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'transfer_notice',
    amount: Number(targetMsg.amount || 0),
    note: targetMsg.note || '转账',
    status: '已收款',
    relatedTransferId: targetMsg.id,
    recalled: false,
    time,
    timeLabel
  });

  currentTransferMessageRef = messages[chatId][idx];

  updateLastMsg(chatId, `[已收款] ¥${targetMsg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
  closeDialog('receiveTransferDialog');
}

function returnIncomingTransfer() {
  const msg = currentTransferMessageRef;
  const chatId = currentTransferChatId;
  if (!msg || !chatId) return;

  if (msg.isMe) {
    closeDialog('receiveTransferDialog');
    return;
  }

  if (msg.type !== 'transfer' || msg.status !== '待收款') {
    closeDialog('receiveTransferDialog');
    return;
  }

  msg.status = '已退回';
  msg.refunded = true;

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_return_notice',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'transfer_notice',
    amount: Number(msg.amount || 0),
    note: msg.note || '转账',
    status: '已退回',
    relatedTransferId: msg.id,
    recalled: false,
    time,
    timeLabel
  });

  updateLastMsg(chatId, `[已退回转账] ¥${msg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
  closeDialog('receiveTransferDialog');
}

function extractVVChatSyncBlock(text) {
  if (!text) return '';
  const match = String(text).match(/\[VV_CHAT_SYNC\]([\s\S]*?)\[\/VV_CHAT_SYNC\]/);
  return match ? match[1].trim() : '';
}

function parseVVSyncMessages(syncText) {
  if (!syncText) return [];

  const blocks = [...String(syncText).matchAll(/\[消息\]([\s\S]*?)\[\/消息\]/g)];

  return blocks.map(match => {
    const block = match[1];

    const getField = (name) => {
      const m = block.match(new RegExp(`${name}=([^\\n]*)`));
      return m ? m[1].trim() : '';
    };

    return {
      side: getField('side'),
      sender: getField('sender'),
      content: getField('content') || getField('text'),
      state: getField('state'),
      transferAction: getField('transferAction'),
      transferAmount: getField('transferAmount'),
      transferNote: getField('transferNote')
    };
  });
}

function handleAITransferDirectives(chatId, text) {
  if (!chatId || !text) return text;

  console.log('[handleAITransferDirectives] raw head=', String(text).slice(0, 500));

  const syncText = extractVVChatSyncBlock(text);
  if (!syncText) return text;

  const syncMessages = parseVVSyncMessages(syncText);

  syncMessages.forEach(msg => {
    if (msg.side !== 'left') return;

    if (msg.transferAction === 'accept') {
      const transferMsg = findLastPendingMyTransfer(chatId);
      if (transferMsg) {
        acceptMyTransferByAI(chatId, transferMsg);
      }
    }

    if (msg.transferAction === 'return') {
      const transferMsg = findLastPendingMyTransfer(chatId);
      if (transferMsg) {
        returnMyTransferByAI(chatId, transferMsg);
      }
    }

    if (msg.transferAction === 'send') {
      const amount = Number(msg.transferAmount || 0);
      if (amount > 0) {
        receiveTransferFromAI(chatId, amount, msg.transferNote || '给你的转账');
      }
    }
  });

  return text;
}

function appendAIMessageToCurrentChat({ chatId, senderName, text, type = 'text' }) {
  if (!chatId) return;

  if (typeof text === 'string' && /\[VV_CHAT_SYNC\][\s\S]*?\[\/VV_CHAT_SYNC\]/i.test(text)) {
    console.log('[appendAIMessageToCurrentChat] ignored raw VV_CHAT_SYNC text');
    return;
  }

  if (!messages[chatId]) messages[chatId] = [];

  let finalText = text || '...';

  if (type === 'text') {
    finalText = handleAITransferDirectives(chatId, finalText);
  }

  if (type === 'text' && !finalText.trim()) {
    renderMessages();
    saveAll();
    return;
  }

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now(),
    sender: chatId,
    senderName: senderName || getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type,
    chunks: type === 'text' ? splitInputToChunks(finalText || '...') : [finalText || '...'],
    recalled: false,
    time,
    timeLabel
  });

  renderMessages();
  updateLastMsg(chatId, finalText || '新消息', time, currentChatType);
  saveAll();
}

// ============================================================
// 电话功能 - 解析 VV_CALL_SYNC
// ============================================================

function parseVVCallSync(raw) {
  if (!raw || typeof raw !== 'string') return null;

  // 提取 [VV_CALL_SYNC] ... [/VV_CALL_SYNC] 块
  const blockMatch = raw.match(/\[VV_CALL_SYNC\]([\s\S]*?)\[\/VV_CALL_SYNC\]/i);
  if (!blockMatch) {
    console.warn('[VV_CALL] no VV_CALL_SYNC block found in raw');
    return null;
  }

  const blockText = blockMatch[1];

  // 解析头部字段
  const getField = (name) => {
    const re = new RegExp('^\\s*' + name + '\\s*=\\s*(.+)', 'im');
    const m = blockText.match(re);
    return m ? m[1].trim() : '';
  };

  const result = {
    chatId: getField('chatId'),
    target: getField('target'),
    callPhase: getField('callPhase'),
    time: getField('time'),
    messages: []
  };

  // 解析 [通话] 块
  const callBlockRegex = /\[通话\]([\s\S]*?)(?=\[通话\]|\[\/VV_CALL_SYNC\]|$)/gi;
  let match;
  while ((match = callBlockRegex.exec(blockText)) !== null) {
    const content = match[1];
    const speaker = (() => {
      const m = content.match(/^\s*speaker\s*=\s*(.+)/im);
      return m ? m[1].trim() : '';
    })();
    const text = (() => {
      const m = content.match(/^\s*content\s*=\s*(.+)/im);
      return m ? m[1].trim() : '';
    })();

    if (speaker && text) {
      result.messages.push({ speaker, text });
    }
  }

  console.log('[VV_CALL] parsed call sync:', result);
  return result;
}

function appendAICommentToFeed({ postId, senderName, text, replyTo = '' }) {
  const post = feedPosts.find(i => i.id === postId);
  if (!post) return;

  post.comments = post.comments || [];
  post.comments.push({
    from: senderName || '角色',
    replyTo: replyTo || '',
    text: text || '……'
  });

  saveAll();
  renderFeedList();
}

function showOperationMenu(e, id) {
  e.preventDefault();
  e.stopPropagation();

  if (currentContactTab !== 'direct') return;

  currentActiveContactId = id;
  const menu = document.getElementById('operationMenu');
  const btn = document.getElementById('stickyBtn');
  const contact = contactList.find(i => i.id === id);
  if (!menu || !btn || !contact) return;

  btn.innerText = contact.isSticky ? '取消置顶' : '置顶';

  const rect = document.getElementById('phoneContainer').getBoundingClientRect();
  menu.style.top = `${e.clientY - rect.top}px`;
  menu.style.right = `16px`;
  menu.classList.add('show');
}

function toggleSticky() {
  const c = contactList.find(i => i.id === currentActiveContactId);
  if (c) {
    c.isSticky = !c.isSticky;
    saveAll();
    renderChatList();
  }
  document.getElementById('operationMenu')?.classList.remove('show');
}

function deleteContact() {
  if (!confirm('确定删除？')) return;

  const removedMessages = messages[currentActiveContactId] || [];
  const refs = [];
  removedMessages.forEach(m => refs.push(...collectRefsFromMessage(m)));

  const setting = chatSettings[currentActiveContactId];
  if (setting) {
    if (isIDBRef(setting.background)) refs.push(setting.background);
    if (isIDBRef(setting.myAvatar)) refs.push(setting.myAvatar);
    if (isIDBRef(setting.theirAvatar)) refs.push(setting.theirAvatar);
  }

  contactList = contactList.filter(i => i.id !== currentActiveContactId);
  delete messages[currentActiveContactId];
  delete chatSettings[currentActiveContactId];
  delete relationshipSettings[currentActiveContactId];

  saveAll();
  renderChatList();
  document.getElementById('operationMenu')?.classList.remove('show');
  removeRefsPossiblyUnused(refs);
}

function showMessageMenu(e, mid) {
  e.preventDefault();
  e.stopPropagation();
  currentMessageAction = { id: mid };
  const menu = document.getElementById('messageOperationMenu');
  if (!menu) return;
  const rect = document.getElementById('phoneContainer').getBoundingClientRect();
  menu.style.top = `${e.clientY - rect.top}px`;
  menu.style.left = `${Math.max(10, e.clientX - rect.left - 40)}px`;
  menu.classList.add('show');
}

function findCurrentMessage() {
  const list = messages[currentChatId] || [];
  return list.find(m => m.id === currentMessageAction?.id);
}

function quoteCurrentMessage() {
  const msg = findCurrentMessage();
  if (!msg) return;
  composerDraft.quote = {
    messageId: msg.id,
    senderName: msg.senderName || (msg.isMe ? '我' : '对方'),
    preview: getMessageSummary(msg)
  };
  renderComposerPreview();
  document.getElementById('messageOperationMenu')?.classList.remove('show');
}

function recallCurrentMessage() {
  const msg = findCurrentMessage();
  if (!msg) return;

  if (!(msg.sender === 'me' || msg.isMe === true)) {
    document.getElementById('messageOperationMenu')?.classList.remove('show');
    alert('只能撤回自己发出的消息');
    return;
  }

  msg.recalled = true;
  renderMessages();
  saveAll();
  document.getElementById('messageOperationMenu')?.classList.remove('show');
}

function deleteCurrentMessage() {
  if (!currentMessageAction) return;

  const list = messages[currentChatId] || [];
  const target = list.find(m => m.id === currentMessageAction.id);
  const refs = target ? collectRefsFromMessage(target) : [];

  messages[currentChatId] = list.filter(m => m.id !== currentMessageAction.id);
  renderMessages();
  saveAll();
  document.getElementById('messageOperationMenu')?.classList.remove('show');
  removeRefsPossiblyUnused(refs);
}

function initDefaultStickers() {
  if (stickerPacks.length) return;
  stickerPacks = [
    { id: 's1', name: '摸摸头', src: 'https://s41.ax1x.com/2026/03/04/pe9kxzR.jpg' },
    { id: 's2', name: '贴贴', src: 'https://s41.ax1x.com/2026/03/08/pePRyo4.jpg' },
    { id: 's3', name: '我要嫁给你', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070736_com.ss.android.ugc.aweme_edit_10274381810346293b0de1b6a9ab34974.jpg' },
    { id: 's4', name: '本皇准了', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070717_com.ss.android.ugc.aweme_edit_1027439026581243742ad1c6449bd1222.jpg' },
    { id: 's5', name: '炸毛的小猫', src: 'https://s41.ax1x.com/2026/03/07/pePE9cd.jpg' },
    { id: 's6', name: '害羞小猫', src: 'https://s41.ax1x.com/2026/03/07/pePEp1H.jpg' },
    { id: 's7', name: '竖中指', src: 'https://s41.ax1x.com/2026/03/24/peKyxP0.jpg' },
    { id: 's8', name: '出现！', src: 'https://origin.picgo.net/2026/04/01/Screenshot_20260401_235612_com.ss.android.ugc.aweme_edit_10936805860700943a95d4ee57e75f1ba.jpg' },
    { id: 's9', name: '略————！', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070639_com.ss.android.ugc.aweme_edit_102744136709186847dd8df865478ae5d.jpg' },
    { id: 's10', name: '生气到跺脚', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070648_com.ss.android.ugc.aweme_edit_102744019583145192b544c46a8f1afe9.jpg' },
    { id: 's11', name: '骄傲', src: 'https://origin.picgo.net/2026/04/01/Screenshot_20260401_235205_com.ss.android.ugc.aweme_edit_109369104937092604fef08e4144e4b58.jpg' },
    { id: 's12', name: '走了！', src: 'https://origin.picgo.net/2026/04/01/Screenshot_20260401_235605_com.ss.android.ugc.aweme_edit_10936822637478545524bc31bf75f3fb7.jpg' } 
  ];
}

function toggleEmojiPanel() {
  const panel = document.getElementById('emojiPanel');
  const toolbar = document.querySelector('.input-toolbar');
  if (!panel || !toolbar) return;
  const isOpen = panel.classList.contains('show');
  if (isOpen) {
    closeEmojiPanel();
  } else {
    renderEmojiPanel();
    panel.style.display = 'block';
    toolbar.classList.add('animating');
    requestAnimationFrame(() => {
      panel.classList.add('show');
    });
  }
}

function renderEmojiPanel() {
  const grid = document.getElementById('emojiPanelGrid');
  if (!grid) return;

  if (!stickerPacks.length) {
    grid.innerHTML = `<div class="empty-state"><span>还没有表情包</span></div>`;
    return;
  }

  grid.innerHTML = stickerPacks.map(s => `
    <div class="emoji-item ${stickerManageMode ? 'manage-mode' : ''}"
         oncontextmenu="event.preventDefault(); enterStickerManageMode('${s.id}')"
         ontouchstart="handleStickerTouchStart('${s.id}')"
         ontouchend="handleStickerTouchEnd()"
         ontouchmove="handleStickerTouchEnd()"
         onmousedown="handleStickerTouchStart('${s.id}')"
         onmouseup="handleStickerTouchEnd()"
         onmouseleave="handleStickerTouchEnd()"
         onclick="${stickerManageMode ? 'return false;' : `sendStickerDirect('${s.id}')`}">

      <img ${buildMediaSrcAttrs(s.src)} alt="">

      ${stickerManageMode
        ? `<div class="sticker-delete-btn" data-sticker-id="${s.id}">×</div>`
        : ''}     
      ${
        stickerManageMode
          ? `<input
               class="sticker-rename-input"
               data-sticker-id="${s.id}"
               value="${escapeHTMLAttr(s.name || '表情')}"
               onclick="event.stopPropagation()"
               onmousedown="event.stopPropagation()"
               ontouchstart="event.stopPropagation()"
               onkeydown="handleStickerRenameKeydown(event, '${s.id}')"
               onblur="saveStickerRename('${s.id}', this.value)"
             >`
          : `<span>${escapeHTML(s.name || '表情')}</span>`
      }
    </div>
  `).join('');

  hydrateMediaRefs(grid);

  if (stickerManageMode && stickerRenameId) {
    requestAnimationFrame(() => {
      const input = document.querySelector(`.sticker-rename-input[data-sticker-id="${stickerRenameId}"]`);
      input?.focus();
      input?.select();
    });
  }
}

function sendStickerDirect(stickerId) {
  if (!currentChatId) return;

  const rel = getRelSetting(currentChatId);
  if (rel.blockedByMe) {
    alert('你已拉黑该联系人，无法发送消息');
    return;
  }
  if (rel.blockedByThem) {
    alert('对方已拉黑你，消息将被拒收');
    return;
  }

  const sticker = stickerPacks.find(s => s.id === stickerId);
  if (!sticker) return;

  if (!messages[currentChatId]) {
    messages[currentChatId] = [];
  }

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_sticker',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'sticker',
    src: sticker.src || '',
    stickerName: sticker.name || '表情',
    desc: '',
    replyTo: null,
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true
  });

  updateLastMsg(currentChatId, `[表情] ${sticker.name || '表情'}`, time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();
  closeEmojiPanel();
}

function closeEmojiPanel() {
  const panel = document.getElementById('emojiPanel');
  const toolbar = document.querySelector('.input-toolbar');
  const messageArea = document.getElementById('messageArea');
  if (!panel || !messageArea) return;
  panel.classList.remove('show');
  // ★ 动态计算而非硬编码
  if (toolbar) {
    messageArea.style.bottom = toolbar.offsetHeight + 'px';
  } else {
    messageArea.style.bottom = '104px';
  }
  setTimeout(() => {
    if (!panel.classList.contains('show')) {
      panel.style.display = 'none';
    }
    if (toolbar) toolbar.classList.remove('animating');
  }, 250);
  if (stickerManageMode) {
    stickerManageMode = false;
    stickerRenameId = null;
    stickerRenameDraft = '';
    renderEmojiPanel();
  }
}

function addStickerDraft(id) {
  const s = stickerPacks.find(i => i.id === id);
  if (!s) return;
  composerDraft.attachments.push({
    type: 'sticker',
    stickerName: s.name,
    src: s.src
  });
  renderComposerPreview();
}

function pickComposerImage() {
  showDialog('imageSendDialog');
}

async function confirmImageDraft() {
  if (!currentChatId) return;

  const rel = getRelSetting(currentChatId);
  if (rel.blockedByMe) {
    alert('你已拉黑该联系人，无法发送消息');
    return;
  }
  if (rel.blockedByThem) {
    alert('对方已拉黑你，消息将被拒收');
    return;
  }

  if (!currentSendImageData) {
    alert('请先选择图片');
    return;
  }

  const storedRef = await persistImageToIDB(currentSendImageData, {
    area: 'composer.image',
    chatId: currentChatId
  });

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();
  const desc = document.getElementById('sendImageDesc')?.value.trim() || '';

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_img',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'image',
    src: storedRef,
    desc,
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true
  });

  updateLastMsg(currentChatId, desc || '[图片]', time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();

  currentSendImageData = null;
  const input = document.getElementById('sendImageInput');
  if (input) input.value = '';
  const descInput = document.getElementById('sendImageDesc');
  if (descInput) descInput.value = '';

  closeDialog('imageSendDialog');
  closeEmojiPanel?.();
  triggerAIReplySoon(80);
}

function addVoiceDraft() {
  showDialog('voiceDialog');
}

function confirmVoiceDraft() {
  if (!currentChatId) return;

  const rel = getRelSetting(currentChatId);
  if (rel.blockedByMe) {
    alert('你已拉黑该联系人，无法发送消息');
    return;
  }
  if (rel.blockedByThem) {
    alert('对方已拉黑你，消息将被拒收');
    return;
  }

  const transcript = document.getElementById('voiceTextInput')?.value.trim();
  const duration = document.getElementById('voiceDurationInput')?.value.trim() || '4';

  if (!transcript) {
    alert('请输入语音转文字内容');
    return;
  }

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_voice',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'voice',
    transcript,
    duration,
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true
  });

  updateLastMsg(currentChatId, '[语音]', time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();

  const textInput = document.getElementById('voiceTextInput');
  if (textInput) textInput.value = '';
  const durationInput = document.getElementById('voiceDurationInput');
  if (durationInput) durationInput.value = '';

  closeDialog('voiceDialog');
  closeEmojiPanel?.();
  triggerAIReplySoon(80);
}

function openTransferDialog() {
  if (!currentChatId) return;
  showDialog('transferDialog');
}

function confirmTransfer() {
  if (!currentChatId) return;

  const rel = getRelSetting(currentChatId);
  if (rel.blockedByMe) {
    alert('你已拉黑该联系人，无法发送消息');
    return;
  }
  if (rel.blockedByThem) {
    alert('对方已拉黑你，消息将被拒收');
    return;
  }

  const amountText = document.getElementById('transferAmount')?.value.trim();
  const note = document.getElementById('transferNote')?.value.trim();

  if (!amountText) {
    alert('请输入金额');
    return;
  }

  const amount = Number(amountText);
  if (!Number.isFinite(amount) || amount <= 0) {
    alert('请输入正确的金额');
    return;
  }

  if (!canAfford(amount)) {
    alert('余额不足');
    return;
  }

  const ok = subtractWalletBalance(amount);
  if (!ok) {
    alert('余额不足');
    return;
  }

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_transfer',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'transfer',
    amount: amount,
    note: note || '转账',
    status: '待收款',
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true,
    settled: true,
    refunded: false
  });

  updateLastMsg(currentChatId, `[转账] ¥${amount}`, time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();

  const amountInput = document.getElementById('transferAmount');
  if (amountInput) amountInput.value = '';
  const noteInput = document.getElementById('transferNote');
  if (noteInput) noteInput.value = '';

  closeDialog('transferDialog');
  closeEmojiPanel?.();
  //triggerAIReplySoon(80);
}

// 拨号弹窗中的搜索过滤
function filterCallContactList() {
  const keyword = document.getElementById('callTargetName')?.value.trim().toLowerCase() || '';
  const container = document.getElementById('callContactSuggestions');
  if (!container) return;

  if (!keyword) {
    // 没输入时显示所有联系人
    renderCallContactList(contactList);
    return;
  }

  const matched = contactList.filter(c => {
    const name = (c.name || '').toLowerCase();
    const bridge = (c.bridgeName || '').toLowerCase();
    return name.includes(keyword) || bridge.includes(keyword);
  });

  renderCallContactList(matched);
}

function renderCallContactList(list) {
  const container = document.getElementById('callContactSuggestions');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = '<div style="color:#999;font-size:13px;padding:8px;">没有匹配的联系人</div>';
    return;
  }

  container.innerHTML = list.map(c => {
    const displayName = c.name || c.bridgeName || '未知';
    const bridgeLabel = c.bridgeName && c.bridgeName !== c.name
      ? `<span style="color:#999;font-size:12px;margin-left:6px;">(${c.bridgeName})</span>`
      : '';

    return `
      <div onclick="playClickSound();selectCallContact('${c.id}')"
           style="padding:10px 12px;border-bottom:1px solid #f0f0f0;cursor:pointer;display:flex;align-items:center;gap:8px;"
           onmouseenter="this.style.background='#f5f5f5'"
           onmouseleave="this.style.background='white'">
        <div style="width:32px;height:32px;border-radius:50%;overflow:hidden;flex-shrink:0;">
          <img src="${c.avatar || DEFAULT_AVATAR}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div>
          <div style="font-size:14px;color:#333;">${displayName}${bridgeLabel}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 点击列表中的联系人，填入输入框
function selectCallContact(contactId) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  const input = document.getElementById('callTargetName');
  if (input) {
    input.value = contact.name || contact.bridgeName || '';
    input.dataset.selectedId = contactId; // 记住选中的ID
  }

  // 清空建议列表
  const container = document.getElementById('callContactSuggestions');
  if (container) {
    container.innerHTML = `
      <div style="padding:10px 12px;color:#07c160;font-size:13px;">
        ✓ 已选择：${contact.name || contact.bridgeName}
        ${contact.bridgeName && contact.bridgeName !== contact.name
          ? ' (角色: ' + contact.bridgeName + ')'
          : ''}
      </div>
    `;
  }
}

function startCallFromDialog() {
  const input = document.getElementById('callTargetName');
  const name = input?.value.trim();
  if (!name) {
    alert('请输入要拨打的联系人');
    return;
  }

  // 优先用选中的ID
  const selectedId = input?.dataset?.selectedId;
  let contact = null;

  if (selectedId) {
    contact = contactList.find(i => i.id === selectedId);
  }

  // 如果没通过点击选中，按输入内容匹配
  if (!contact) {
    // 优先匹配备注名（精确）
    contact = contactList.find(i => i.name === name);
  }
  if (!contact) {
    // 再匹配角色名（精确）
    contact = contactList.find(i => i.bridgeName === name);
  }
  if (!contact) {
    // 模糊匹配备注名
    contact = contactList.find(i =>
      (i.name || '').includes(name) || name.includes(i.name || '')
    );
  }
  if (!contact) {
    // 模糊匹配角色名
    contact = contactList.find(i =>
      (i.bridgeName || '').includes(name) || name.includes(i.bridgeName || '')
    );
  }

  // 都没找到，新建联系人
  if (!contact) {
    const id = 'c' + Date.now();
    const time = getNowTime();
    contact = {
      id,
      name,
      avatar: DEFAULT_AVATAR,
      isSticky: false,
      lastTime: time,
      bridgeName: name,
      threadType: 'direct'
    };
    contactList.unshift(contact);

    if (!messages[id]) {
      messages[id] = [{
        id: 'm' + Date.now(),
        sender: 'system',
        senderName: '系统',
        isMe: false,
        type: 'system',
        chunks: ['已通过电话建立联系'],
        time,
        timeLabel: getNowFullLabel()
      }];
    }

    getChatSetting(id);
    getRelSetting(id);
  }

  // 清理选中状态
  if (input) {
    delete input.dataset.selectedId;
  }

  saveAll();
  closeDialog('addCallDialog');
  simulateOutgoingCall(contact.id);
}

// ============================================================
// 电话功能 - 拨打电话
// ============================================================
async function simulateOutgoingCall(contactId) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  // 重置通话状态
  currentCallId = contactId;
  currentCallTarget = contact.name || '';
  currentCallContact = contact;
  currentCallPhase = 'calling';
  callStartTimestamp = null;
  callStartTime = null;
  if (callTimerInterval) clearInterval(callTimerInterval);
  callTimerInterval = null;
  callLogs[contactId] = [];
  callTranscript = [];
  isWaitingCallAIReply = false;

  // 显示呼叫界面
  hideAllPages();
  document.getElementById('callPage').style.display = 'block';
  document.getElementById('callName').innerText = contact.name;
  document.getElementById('callAvatar').src =
    await resolveImageRefToUrl(
      getContactAvatarById(contactId)
    );
  document.getElementById('callStatus').innerText = '正在呼叫…';
  document.getElementById('callTranscript').innerHTML = '<div class="call-line system">拨号中…</div>';

  // 隐藏输入区（呼叫中不能说话）
  setCallInputVisible(false);

  const bridgeName = contact.bridgeName || contact.name;

  let slashOk = false;

  // 在拨打电话函数的开头（接通前），通知host启动拦截器
  if (window.parent && window.parent !== window) {
    console.log('[VV_APP] 发送 VV_CALL_START to parent, parent===top:', window.parent === window.top);
    window.parent.postMessage({
      type: 'VV_CALL_START',
      targetName: contact.name || contact.bridgeName || '',
      chatId: contactId,
      storyTime: typeof getNowTime === 'function' ? getNowTime() : ''
    }, '*');
  } else {
    console.warn('[VV_APP] 无法发送 VV_CALL_START: 不在 iframe 中');
  }

  if (VV_BRIDGE_CONFIG.enabled &&
      (VV_BRIDGE_CONFIG.callMode === 'slash' || VV_BRIDGE_CONFIG.callMode === 'local+slash')) {

    const promptText = buildVVCallEventPayload(contactId, 'calling', '');

    const cmd = VV_BRIDGE_CONFIG.buildCallEventCommand({
      bridgeName,
      chatId: contactId,
      callPhase: 'calling',
      promptText
    });

    slashOk = await triggerSlash(cmd, {
      callMode: true,
      callPhase: 'calling',
      chatId: contactId,
      targetName: contact.name || contact.bridgeName || ''
    });
  }

  if (!slashOk || VV_BRIDGE_CONFIG.callMode === 'local') {
    const outcomes = ['accepted', 'rejected', 'missed'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    setTimeout(() => {
      if (currentCallId !== contactId) return;

      if (result === 'accepted') {
        handleCallAccepted(contactId, contact.name, '喂，你好。');
      } else if (result === 'rejected') {
        handleCallRejected(contactId);
      } else {
        handleCallMissed(contactId);
      }
    }, 800 + Math.random() * 700);
  }

  // 呼叫超时安全网（60秒无回应当作无人接听）
  setTimeout(() => {
    if (currentCallId === contactId && currentCallPhase === 'calling') {
      console.warn('[VV_CALL] calling timeout, no response from AI');
      handleCallMissed(contactId);
    }
  }, 60000);
}

// ============================================================
// 电话功能 - 通话状态处理
// ============================================================

function handleCallAccepted(contactId, speakerName, firstLine) {
  console.log('[VV_CALL] handleCallAccepted called:', {
    contactId,
    currentCallId,
    speakerName,
    firstLine,
    match: currentCallId === contactId
  });
  if (currentCallId !== contactId) return;

  currentCallPhase = 'talking';
  callStartTimestamp = Date.now();
  callStartTime = Date.now();

  document.getElementById('callStatus').innerText = '通话中';

  // 启动计时器
  if (callTimerInterval) clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    if (currentCallPhase !== 'talking') {
      clearInterval(callTimerInterval);
      return;
    }
    const elapsed = Math.floor((Date.now() - callStartTimestamp) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const statusEl = document.getElementById('callStatus');
    if (statusEl) statusEl.innerText = '通话中 ' + mm + ':' + ss;
  }, 1000);

  // 初始化
  if (!callLogs[contactId]) callLogs[contactId] = [];
  if (!Array.isArray(callTranscript)) callTranscript = [];

  if (firstLine) {
    callLogs[contactId].push({
      speaker: speakerName || '对方',
      isMe: false,
      text: firstLine,
      time: getNowTime()
    });
    callTranscript.push({
      speaker: speakerName || '对方',
      content: firstLine
    });
  }

  // 显示输入区
  setCallInputVisible(true);
  renderCallTranscript();
  saveAll();

  removeCallTypingIndicator();
  isWaitingCallAIReply = false;
}

function handleCallRejected(contactId) {
  if (currentCallId !== contactId) return;

  currentCallPhase = 'ended';
  document.getElementById('callStatus').innerText = '对方已拒接';
  document.getElementById('callTranscript').innerHTML =
    '<div class="call-line system">通话未接通，对方拒接了你的来电。</div>';
  setCallInputVisible(false);

  // 写一条系统消息到聊天记录
  writeCallSystemMessage(contactId, '呼叫被拒接');
}

function handleCallMissed(contactId) {
  if (currentCallId !== contactId) return;

  currentCallPhase = 'ended';
  document.getElementById('callStatus').innerText = '无人接听';
  document.getElementById('callTranscript').innerHTML =
    '<div class="call-line system">通话未接通，对方暂时没有接听。</div>';
  setCallInputVisible(false);

  writeCallSystemMessage(contactId, '呼叫无人接听');
}

function writeCallSystemMessage(contactId, text) {
  if (!messages[contactId]) messages[contactId] = [];
  messages[contactId].push({
    id: 'm' + Date.now(),
    sender: 'system',
    senderName: '系统',
    isMe: false,
    type: 'system',
    chunks: [text],
    time: getNowTime(),
    timeLabel: getNowFullLabel()
  });
  saveAll();
}

function setCallInputVisible(visible) {
  const area = document.querySelector('#callPage .call-input-area');
  if (area) {
    area.style.display = visible ? 'flex' : 'none';
  }
}

function removeCallTypingIndicator() {
  const el = document.getElementById('callTypingIndicator');
  if (el) el.remove();
}

function getCallDurationText() {
  if (!callStartTimestamp) return '0秒';
  const elapsed = Math.floor((Date.now() - callStartTimestamp) / 1000);
  if (elapsed < 60) return elapsed + '秒';
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  return mm + '分' + (ss > 0 ? ss + '秒' : '');
}

async function openCallPage(contactId, accepted = false) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  currentCallId = contactId;
  hideAllPages();
  document.getElementById('callPage').style.display = 'block';

  document.getElementById('callName').innerText = contact.name;
  document.getElementById('callAvatar').src =
    await resolveImageRefToUrl(
      getContactAvatarById(contactId)
    );
  document.getElementById('callStatus').innerText = accepted ? '通话中…' : '正在连接…';

  if (!callLogs[contactId]) {
    callLogs[contactId] = [
      { speaker: contact.name, isMe: false, text: '喂，我接到了。', time: getNowTime() }
    ];
  }

  renderCallTranscript();
  saveAll();
}

function splitInputToChunks(raw) {
  if (!raw) return [];
  return raw.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
}

function renderCallTranscript() {
  const container = document.getElementById('callTranscript');
  if (!container) return;

  const contactId = currentCallId;
  const logs = callLogs[contactId] || [];

  if (logs.length === 0) {
    if (currentCallPhase === 'talking') {
      container.innerHTML = '<div class="call-line system">通话已接通</div>';
    }
    return;
  }

  let html = '';
  logs.forEach(item => {
    const cssClass = item.isMe ? 'me' : 'them';
    const speakerName = escapeHTML(item.speaker || '');
    const text = escapeHTML(item.text || '');

    html += '<div class="call-line ' + cssClass + '">';
    if (!item.isMe) {
      html += '<span class="call-speaker">' + speakerName + '：</span>';
    }
    html += '<span class="call-text">' + text + '</span>';
    html += '</div>';
  });

  container.innerHTML = html;

  // 滚动到底部
  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

async function sendCallMessage() {
  const input = document.getElementById('callInput');
  const raw = input?.value.trim();
  if (!raw || !currentCallId) return;
  if (currentCallPhase !== 'talking') return;
  if (isWaitingCallAIReply) return;

  const lines = splitInputToChunks(raw);
  if (!lines.length) return;

  if (!callLogs[currentCallId]) callLogs[currentCallId] = [];
  if (!Array.isArray(callTranscript)) callTranscript = [];

  lines.forEach(line => {
    callLogs[currentCallId].push({
      speaker: '我',
      isMe: true,
      text: line,
      time: getNowTime()
    });
    callTranscript.push({
      speaker: '我',
      content: line
    });
  });

  input.value = '';
  renderCallTranscript();
  saveAll();

  // 通知 host 拦截器记录用户发言
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: 'VV_CALL_USER_SPEAK',
      lines: lines
    }, '*');
  }

  isWaitingCallAIReply = true;
  appendCallTypingIndicator();

  const contact = contactList.find(i => i.id === currentCallId);
  const bridgeName = contact?.bridgeName || contact?.name || '角色';
  const contactId = currentCallId;

  let slashOk = false;

  if (VV_BRIDGE_CONFIG.enabled &&
      (VV_BRIDGE_CONFIG.callMode === 'slash' || VV_BRIDGE_CONFIG.callMode === 'local+slash')) {

    const promptText = buildVVCallEventPayload(contactId, 'talking', lines.join('\n'));

    const cmd = VV_BRIDGE_CONFIG.buildCallEventCommand({
      bridgeName,
      chatId: contactId,
      callPhase: 'talking',
      promptText
    });

    slashOk = await triggerSlash(cmd);
  }

  if (!slashOk || VV_BRIDGE_CONFIG.callMode === 'local') {
    setTimeout(() => {
      if (currentCallId !== contactId) return;

      removeCallTypingIndicator();
      isWaitingCallAIReply = false;

      const replyText = '嗯，我听到了，你继续说。';

      callLogs[contactId].push({
        speaker: contact?.name || '对方',
        isMe: false,
        text: replyText,
        time: getNowTime()
      });
      callTranscript.push({
        speaker: contact?.name || '对方',
        content: replyText
      });

      renderCallTranscript();
      saveAll();
    }, 1000 + Math.random() * 1000);
  }

  // 超时安全网
  setTimeout(() => {
    if (isWaitingCallAIReply && currentCallId === contactId) {
      console.warn('[VV_CALL] AI reply timeout');
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;

      if (currentCallPhase === 'talking') {
        // 通话中超时，不挂断，允许用户继续说话
        console.log('[VV_CALL] talking timeout, keeping call alive');
        if (!callLogs[contactId]) callLogs[contactId] = [];
        callLogs[contactId].push({
          speaker: '系统',
          isMe: false,
          text: '（对方暂时没有回应…）',
          time: getNowTime()
        });
        renderCallTranscript();
        setCallInputVisible(true);
      }
    }
  }, 60000);
}

function jumpCallToChat() {
  if (!currentCallId) return;

  const contactId = currentCallId;

  // 停止计时器
  if (callTimerInterval) {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
  }

  // 生成通话摘要写入聊天记录
  const contact = contactList.find(i => i.id === contactId);
  const duration = callStartTimestamp
    ? Math.floor((Date.now() - callStartTimestamp) / 1000)
    : 0;

  if (duration > 0 && contact) {
    const mm = String(Math.floor(duration / 60)).padStart(2, '0');
    const ss = String(duration % 60).padStart(2, '0');

    // 把通话记录作为系统消息插入聊天
    if (!chatHistories[contactId]) chatHistories[contactId] = [];
    chatHistories[contactId].push({
      role: 'system',
      content: `📞 通话结束，时长 ${mm}:${ss}`,
      time: getNowTime(),
      type: 'call-summary'
    });
  }

  // 重置通话状态（不调用endCall避免页面跳转冲突）
  currentCallPhase = 'ended';
  isWaitingCallAIReply = false;
  removeCallTypingIndicator();

  // 隐藏通话页，打开聊天页
  document.getElementById('callPage').style.display = 'none';

  // 给一点点延迟确保DOM更新完
  requestAnimationFrame(() => {
    if (typeof openChatDetail === 'function') {
      openChatDetail(contactId, '');
    }
  });

  // 最后清理
  currentCallId = null;
  callStartTimestamp = null;
  callStartTime = null;
  saveAll();
}

function endCall() {
  // 在 endCall 函数开头
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'VV_CALL_END' }, '*');
  }

  if (!currentCallId) {
    closeCallPage();
    return;
  }

  const contactId = currentCallId;
  const contact = contactList.find(i => i.id === contactId);
  const duration = getCallDurationText();
  const logs = callLogs[contactId] || [];

  // 停止计时器
  if (callTimerInterval) {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
  }

  // 更新UI
  document.getElementById('callStatus').innerText = '通话结束';
  setCallInputVisible(false);
  removeCallTypingIndicator();
  isWaitingCallAIReply = false;
  currentCallPhase = 'ended';

  // 把完整通话记录写入聊天消息
  if (contact && logs.length > 0) {
    if (!messages[contactId]) messages[contactId] = [];

    // 写入一条通话记录类型的消息
    messages[contactId].push({
      id: 'm' + Date.now() + '_callrecord',
      sender: 'system',
      senderName: '系统',
      isMe: false,
      type: 'call-record',
      callWith: contact.name,
      callDuration: duration,
      callStartTime: callStartTimestamp
        ? new Date(callStartTimestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        : getNowTime(),
      callEndTime: getNowTime(),
      callTranscript: JSON.parse(JSON.stringify(logs)), // 深拷贝完整通话记录
      time: getNowTime(),
      timeLabel: getNowFullLabel(),
      recalled: false
    });

    // 更新联系人最后消息
    updateLastMsg(contactId, '通话 ' + duration, getNowTime(), 'direct');
  } else if (contact) {
    writeCallSystemMessage(contactId, '与' + contact.name + '的通话已结束');
  }

  saveAll();

  // 延迟关闭
  setTimeout(closeCallPage, 600);
}

function appendCallTypingIndicator() {
  const container = document.getElementById('callTranscript');
  if (!container) return;
  // 先移除旧的
  removeCallTypingIndicator();

  const indicator = document.createElement('div');
  indicator.className = 'call-line system call-typing-indicator';
  indicator.id = 'callTypingIndicator';
  indicator.textContent = '对方正在说话...';
  container.appendChild(indicator);

  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

function openCallFromChat() {
  if (!currentChatId || currentChatType !== 'direct') {
    alert('当前只有单聊可以直接拨打电话');
    return;
  }
  simulateOutgoingCall(currentChatId);
}

// ============================================================
// 电话功能 - 来电（替换旧的 simulateIncomingCall）
// ============================================================

async function simulateIncomingCall(contactId) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  // 如果正在通话中，忽略来电
  if (currentCallPhase === 'talking' || currentCallPhase === 'calling') {
    console.log('[VV_CALL] ignored incoming call: already in call');
    return;
  }

  currentIncomingCallId = contactId;
  currentCallPhase = 'ringing';

  hideAllPages();
  document.getElementById('incomingCallPage').style.display = 'block';
  document.getElementById('incomingName').innerText = contact.name;
  document.getElementById('incomingAvatar').src = await resolveImageRefToUrl(
    getChatSetting(contactId).theirAvatar || DEFAULT_AVATAR
  );
  resetSwipeThumb();
}

function acceptIncomingCall() {
  if (!currentIncomingCallId) return;

  const contactId = currentIncomingCallId;
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  currentIncomingCallId = null;

  // 初始化通话
  currentCallId = contactId;
  currentCallPhase = 'talking';
  callStartTimestamp = Date.now();
  callLogs[contactId] = [];

  // 切到通话界面
  hideAllPages();
  document.getElementById('callPage').style.display = 'block';
  document.getElementById('callName').innerText = contact.name;

  resolveImageRefToUrl(
    getContactAvatarById(contactId)
  ).then(url => {
    document.getElementById('callAvatar').src = url;
  });

  document.getElementById('callStatus').innerText = '通话中 00:00';
  setCallInputVisible(true);

  // 启动计时器
  if (callTimerInterval) clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    if (!callStartTimestamp) return;
    const elapsed = Math.floor((Date.now() - callStartTimestamp) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const statusEl = document.getElementById('callStatus');
    if (statusEl) statusEl.innerText = '通话中 ' + mm + ':' + ss;
  }, 1000);

  // 请求AI说开场白
  requestIncomingCallGreeting(contactId);

  renderCallTranscript();
  saveAll();
}

function rejectIncomingCall() {
  if (!currentIncomingCallId) return;

  const contactId = currentIncomingCallId;
  currentIncomingCallId = null;
  currentCallPhase = 'idle';

  writeCallSystemMessage(contactId, '你拒接了来电');

  hideAllPages();
  document.getElementById('homePage').style.display = 'block';
}

async function requestIncomingCallGreeting(contactId) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  const bridgeName = contact.bridgeName || contact.name;

  isWaitingCallAIReply = true;
  appendCallTypingIndicator();

  let slashOk = false;

  if (VV_BRIDGE_CONFIG.enabled &&
      (VV_BRIDGE_CONFIG.callMode === 'slash' || VV_BRIDGE_CONFIG.callMode === 'local+slash')) {

    const promptText = buildVVCallEventPayload(contactId, 'incoming', '');

    const cmd = VV_BRIDGE_CONFIG.buildCallEventCommand({
      bridgeName,
      chatId: contactId,
      callPhase: 'incoming',
      promptText
    });

    slashOk = await triggerSlash(cmd);
  }

  if (!slashOk || VV_BRIDGE_CONFIG.callMode === 'local') {
    setTimeout(() => {
      if (currentCallId !== contactId) return;

      removeCallTypingIndicator();
      isWaitingCallAIReply = false;

      callLogs[contactId].push({
        speaker: contact.name,
        isMe: false,
        text: '喂，你好，我刚才想找你聊聊。',
        time: getNowTime()
      });
      renderCallTranscript();
      saveAll();
    }, 1200);
  }

  // 超时兜底
  setTimeout(() => {
    if (isWaitingCallAIReply && currentCallId === contactId) {
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;
    }
  }, 15000);
}

function resetSwipeThumb() {
  const thumb = document.getElementById('swipeThumb');
  const track = document.getElementById('swipeTrack');
  if (thumb && track) {
    const center = (track.clientWidth - 44) / 2;
    thumb.style.transition = 'left 0.15s ease';
    thumb.style.left = center + 'px';
    thumb.classList.remove('reject');
  }
}

// ============================================================
// 电话功能 - 处理AI返回的通话同步
// ============================================================

async function handleVVCallSyncRaw(payload) {
  console.log('[VV_CALL] handleVVCallSyncRaw called:', payload);

  const raw = typeof payload === 'string' ? payload : (payload?.raw || '');

  let parsed = parseVVCallSync(raw);

  if (!parsed && raw.includes('[VV_CHAT_SYNC]')) {
    console.log('[VV_CALL] no VV_CALL_SYNC found, trying to extract from VV_CHAT_SYNC');
    await handleVVChatSyncAsCall(raw);
    return;
  }

  if (!parsed) {
    parsed = extractCallContentFromFreeText(raw);
  }

  if (!parsed || !parsed.callPhase) {
    console.warn('[VV_CALL] could not parse call sync');
    removeCallTypingIndicator();
    isWaitingCallAIReply = false;
    return;
  }

  const contactId = parsed.chatId || currentCallId;
  if (!contactId) return;

  console.log('[VV_CALL] parsed result:', parsed);

  // 确保 callTranscript 存在
  if (!Array.isArray(callTranscript)) callTranscript = [];
  if (!callLogs[contactId]) callLogs[contactId] = [];

  switch (parsed.callPhase.toLowerCase()) {
    case 'accept':
    case 'accepted':
    case 'connected': {
      const firstLine = parsed.messages.length > 0 ? parsed.messages[0].text : '喂，你好。';
      console.log('[VV_CALL] ACCEPT case:', {
        contactId,
        currentCallId,
        currentCallPhase,
        firstLine,
        target: parsed.target,
        messagesCount: parsed.messages.length
      });
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;
      handleCallAccepted(contactId, parsed.target || parsed.messages[0]?.speaker || '对方', firstLine);

      if (parsed.messages.length > 1) {
        for (let i = 1; i < parsed.messages.length; i++) {
          const msg = parsed.messages[i];
          callLogs[contactId].push({
            speaker: msg.speaker,
            isMe: false,
            text: msg.text,
            time: getNowTime()
          });
          callTranscript.push({
            speaker: msg.speaker,
            content: msg.text
          });
        }
        renderCallTranscript();
        saveAll();
      }
      break;
    }

    case 'reject':
    case 'rejected': {
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;
      handleCallRejected(contactId);
      break;
    }

    case 'miss':
    case 'missed': {
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;
      handleCallMissed(contactId);
      break;
    }

    case 'reply':
    case 'talking': {
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;

      // 如果还在呼叫阶段，AI跳过了accept直接reply，当作接听
      if (currentCallPhase === 'calling') {
        console.log('[VV_CALL] callPhase=reply but still calling, treating as accept');
        var firstMsg = parsed.messages.length > 0 ? parsed.messages[0].text : '喂？';
        var contact = contactList.find(i => i.id === contactId);
        handleCallAccepted(contactId, parsed.target || contact?.name || '对方', firstMsg);
        parsed.messages = parsed.messages.slice(1);
      }

      parsed.messages.forEach(msg => {
        callLogs[contactId].push({
          speaker: msg.speaker,
          isMe: false,
          text: msg.text,
          time: getNowTime()
        });
        callTranscript.push({
          speaker: msg.speaker,
          content: msg.text
        });
      });

      if (parsed.messages.length > 0) {
        renderCallTranscript();
        saveAll();
      }
      break;
    }

    case 'end':
    case 'hangup': {
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;

      if (parsed.messages.length > 0) {
        parsed.messages.forEach(msg => {
          callLogs[contactId].push({
            speaker: msg.speaker,
            isMe: false,
            text: msg.text,
            time: getNowTime()
          });
          callTranscript.push({
            speaker: msg.speaker,
            content: msg.text
          });
        });
        renderCallTranscript();
      }

      setTimeout(() => {
        if (currentCallId === contactId) {
          endCall();
        }
      }, 1500);
      break;
    }

    default:
      console.warn('[VV_CALL] unknown callPhase:', parsed.callPhase);
      removeCallTypingIndicator();
      isWaitingCallAIReply = false;
  }
}

// 从VV_CHAT_SYNC格式中提取通话内容的兼容处理
async function handleVVChatSyncAsCall(raw) {
  const parsed = parseVVChatBlocks(raw, { chatId: currentCallId });
  if (!parsed || !parsed.messages || !parsed.messages.length) {
    removeCallTypingIndicator();
    isWaitingCallAIReply = false;
    return;
  }

  removeCallTypingIndicator();
  isWaitingCallAIReply = false;

  const contactId = parsed.chatId || currentCallId;
  if (!contactId || !callLogs[contactId]) return;

  // 只取对方的消息（side=left）
  const theirMsgs = parsed.messages.filter(m => m.side === 'left');
  theirMsgs.forEach(m => {
    callLogs[contactId].push({
      speaker: m.sender || parsed.target || '对方',
      isMe: false,
      text: m.content || '',
      time: getNowTime()
    });
  });

  renderCallTranscript();
  saveAll();
}

// 从自由文本中提取对话内容（最终降级方案）
function extractCallContentFromFreeText(raw) {
  if (!raw || typeof raw !== 'string') return null;

  const lines = raw.split('\n').filter(l => l.trim());
  const messages = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 匹配 "角色名：内容" 或 "角色名: 内容" 格式
    const colonMatch = trimmed.match(/^(.{1,20})[：:]\s*(.+)/);
    if (colonMatch) {
      const speaker = colonMatch[1].trim();
      const text = colonMatch[2].trim().replace(/^["「『]|["」』]$/g, '');
      if (speaker && text && speaker !== '用户' && speaker !== '我') {
        messages.push({ speaker, text });
      }
    }
    // 匹配引号内容
    else {
      const quoteMatch = trimmed.match(/["「『](.+?)["」』]/);
      if (quoteMatch && quoteMatch[1].length > 1) {
        messages.push({ speaker: '对方', text: quoteMatch[1] });
      }
    }
  }

  if (messages.length === 0) return null;

  return {
    chatId: currentCallId || '',
    target: messages[0]?.speaker || '',
    callPhase: currentCallPhase === 'calling' ? 'accept' : 'reply',
    time: getNowTime(),
    messages
  };
}
/**
 * 检测AI输出中是否包含来电触发信号
 * 调用时机：在收到任何AI消息后调用此函数
 * 例如在 handleVVChatSyncRaw 末尾、或酒馆消息监听中调用
 */
function checkForIncomingCallTrigger(aiOutputText) {
  if (!aiOutputText || typeof aiOutputText !== 'string') return;

  // 如果正在通话中，不触发新来电
  if (currentCallPhase === 'talking' || currentCallPhase === 'calling' || currentCallPhase === 'ringing') {
    return;
  }

  // 方式1：检查明确的来电指令块
  const blockMatch = aiOutputText.match(
    /\[VV_INCOMING_CALL\]([\s\S]*?)\[\/VV_INCOMING_CALL\]/i
  );

  if (blockMatch) {
    const block = blockMatch[1];
    const callerMatch = block.match(/^\s*caller\s*=\s*(.+)/im);
    const chatIdMatch = block.match(/^\s*chatId\s*=\s*(.+)/im);

    const callerName = callerMatch ? callerMatch[1].trim() : '';
    const chatId = chatIdMatch ? chatIdMatch[1].trim() : '';

    if (callerName) {
      console.log('[VV_CALL] detected incoming call block, caller:', callerName);
      triggerIncomingCallByName(callerName, chatId);
      return;
    }
  }

  // 方式2：检测自然语言中的"打电话"意图
  // 匹配类似：
  //   "西西给用户打去了电话"
  //   "她拨通了用户的电话"
  //   "XXX打开手机拨打了用户的号码"
  //   "XXX想给用户打电话"
  //   "XXX拨出了电话"
  const callPatterns = [
    /(.{1,15}?)(?:给|向|朝).{0,10}?(?:用户|你|玩家).{0,10}?(?:打|拨|拨打|拨通|打去|打来|打了|拨了|拨去).{0,6}?(?:电话|手机|来电)/,
    /(.{1,15}?)(?:打|拨|拨打|拨通).{0,6}?(?:用户|你|玩家).{0,10}?(?:电话|手机|号码)/,
    /(.{1,15}?)(?:拨出了电话|拨通了电话|打来了电话|打来电话|来电了)/,
    /(.{1,15}?)(?:想(?:要)?(?:给|跟|和).{0,8}?(?:用户|你|玩家).{0,6}?打电话)/,
    /(.{1,15}?)(?:(?:拿起手机|打开手机).{0,4}(?:拨给|打给)|拨给)/
  ];

  for (const pattern of callPatterns) {
    const match = aiOutputText.match(pattern);
    if (match) {
      let callerName = match[1].trim();

      // 清理常见的前缀噪音
      callerName = callerName
        .replace(/^[，。、！？\s"「『（(]+/, '')
        .replace(/[，。、！？\s"」』）)]+$/, '')
        .trim();

      // 过滤掉太短或明显不是名字的结果
      if (callerName.length >= 1 && callerName.length <= 12) {
        console.log('[VV_CALL] detected incoming call intent from text, caller:', callerName);

        // 延迟触发，给用户一个"剧情过渡"的感觉
        setTimeout(() => {
          triggerIncomingCallByName(callerName, '');
        }, 1500 + Math.random() * 2000);
        return;
      }
    }
  }
}

/**
 * 根据角色名触发来电
 */
function triggerIncomingCallByName(callerName, chatId) {
  if (!callerName) return;

  let contact = null;

  // 优先通过chatId查找
  if (chatId) {
    contact = contactList.find(i => String(i.id) === String(chatId));
  }

  // 其次通过名字查找（模糊匹配）
  if (!contact) {
    contact = contactList.find(i =>
      i.name === callerName ||
      i.bridgeName === callerName ||
      (i.name && i.name.includes(callerName)) ||
      (callerName && callerName.includes(i.name))
    );
  }

  // 如果联系人不存在，自动创建一个
  if (!contact) {
    const newId = 'contact_' + Date.now();
    contact = {
      id: newId,
      name: callerName,
      bridgeName: callerName,
      avatar: DEFAULT_AVATAR,
      isSticky: false,
      lastTime: getNowTime(),
      lastPreview: '',
      threadType: 'direct'
    };
    contactList.unshift(contact);
    if (!messages[newId]) messages[newId] = [];
    console.log('[VV_CALL] auto-created contact for incoming call:', contact);
  }

  console.log('[VV_CALL] triggering incoming call from:', contact.name, contact.id);
  simulateIncomingCall(contact.id);
}

function renderCallRecordMessage(m) {
  const transcript = m.callTranscript || [];
  const duration = m.callDuration || '未知时长';
  const callWith = m.callWith || '联系人';
  const callTime = m.callStartTime || m.time || '';
  const msgId = m.id || ('call_' + Date.now());

  let transcriptHtml = '';
  transcript.forEach(function(log) {
    const cls = log.isMe ? 'transcript-me' : 'transcript-them';
    const label = log.isMe ? '我' : (log.speaker || '对方');
    transcriptHtml += '<div class="' + cls + '">'
      + '<b>' + escapeHTML(label) + '：</b>'
      + escapeHTML(log.text || '')
      + '</div>';
  });

  // 如果没有通话内容（未接/拒接）
  if (transcript.length === 0) {
    return '<div class="message-bubble call-record-bubble">'
      + '<div class="call-record-header">'
      + '<span class="call-record-icon">📞</span>'
      + '<span>与 ' + escapeHTML(callWith) + ' 的通话 · ' + escapeHTML(duration) + '</span>'
      + '</div>'
      + '</div>';
  }

  return '<div class="message-bubble call-record-bubble" onclick="toggleCallTranscript(\'' + msgId + '\')">'
    + '<div class="call-record-header">'
    + '<span class="call-record-icon">📞</span>'
    + '<span>与 ' + escapeHTML(callWith) + ' 的通话 · ' + escapeHTML(duration) + '</span>'
    + '<span class="call-expand-hint">点击展开</span>'
    + '</div>'
    + '<div class="call-transcript-detail" id="callDetail_' + msgId + '">'
    + transcriptHtml
    + '</div>'
    + '</div>';
}

function toggleCallTranscript(msgId) {
  const el = document.getElementById('callDetail_' + msgId);
  if (el) {
    el.classList.toggle('expanded');
    // 更新提示文字
    const bubble = el.parentElement;
    if (bubble) {
      const hint = bubble.querySelector('.call-expand-hint');
      if (hint) {
        hint.textContent = el.classList.contains('expanded') ? '点击收起' : '点击展开';
      }
    }
  }
}

async function openChatSettingPage() {
  if (!currentChatId || currentChatType !== 'direct') {
    alert('当前只有单聊可进入聊天设置');
    return;
  }

  const contact = contactList.find(i => i.id === currentChatId);
  const set = normalizeChatSetting(currentChatId);
  const rel = getRelSetting(currentChatId);

  const titleEl = document.getElementById('profileTitleName');
  if (titleEl) titleEl.innerText = contact?.name || '联系人';

  const profileCover = document.getElementById('profileCover');
  const theirAvatar = document.getElementById('profileTheirAvatar');
  const myPreview = document.getElementById('profileMyAvatarPreview');
  const theirPreview = document.getElementById('profileTheirAvatarPreview');

  const bgSrc = getChatBackground(currentChatId);
  const myAvatarSrc = getMyAvatar(currentChatId);
  const theirAvatarSrc = set.theirAvatar || DEFAULT_AVATAR;

  if (profileCover) {
    if (bgSrc) {
      profileCover.style.backgroundImage = `url(${await resolveImageRefToUrl(bgSrc)})`;
      profileCover.style.backgroundSize = 'cover';
      profileCover.style.backgroundPosition = 'center';
    } else {
      profileCover.style.backgroundImage = 'linear-gradient(135deg, #f7d9e9, #d8edf7)';
    }
  }

  if (theirAvatar) {
    theirAvatar.src = await resolveImageRefToUrl(theirAvatarSrc);
  }

  if (myPreview) {
    myPreview.src = await resolveImageRefToUrl(myAvatarSrc);
  }

  if (theirPreview) {
    theirPreview.src = await resolveImageRefToUrl(theirAvatarSrc);
  }

  const chip = document.getElementById('blockToggleChip');
  if (chip) {
    chip.innerText = rel.blockedByMe ? '已拉黑' : '未拉黑';
    chip.classList.toggle('active', rel.blockedByMe);
  }

  document.getElementById('chatDetailPage').style.display = 'none';
  document.getElementById('chatSettingPage').style.display = 'block';
    // 初始化时间设置 UI
  const ts = getTimeSetting(currentChatId);
  const timeModeSelect = document.getElementById('timeModeSelect');
  if (timeModeSelect) {
    timeModeSelect.value = ts.mode || 'story';
  }

  const manualRow = document.getElementById('manualTimeRow');
  if (manualRow) {
    manualRow.style.display = ts.mode === 'manual' ? 'flex' : 'none';
  }

  const manualInput = document.getElementById('manualTimeInput');
  if (manualInput && ts.manualTime) {
    manualInput.value = ts.manualTime;
  }

  startTimePreviewUpdate();
}

function toggleBlockCurrentContact() {
  const rel = getRelSetting(currentChatId);
  rel.blockedByMe = !rel.blockedByMe;
  saveAll();
  openChatSettingPage();
  renderChatList();
}

function clearCurrentChatHistory() {
  if (!currentChatId) return;
  if (!confirm('确定清空当前聊天记录？')) return;

  const refs = [];
  (messages[currentChatId] || []).forEach(m => refs.push(...collectRefsFromMessage(m)));

  messages[currentChatId] = [];
  saveAll();
  alert('已清空');
  removeRefsPossiblyUnused(refs);
}

function deleteCurrentChatFromSetting() {
  if (!currentChatId) return;
  if (!confirm('确定删除该聊天与联系人？')) return;

  const refs = [];
  (messages[currentChatId] || []).forEach(m => refs.push(...collectRefsFromMessage(m)));

  const setting = chatSettings[currentChatId];
  if (setting) {
    if (isIDBRef(setting.background)) refs.push(setting.background);
    if (isIDBRef(setting.myAvatar)) refs.push(setting.myAvatar);
    if (isIDBRef(setting.theirAvatar)) refs.push(setting.theirAvatar);
  }

  contactList = contactList.filter(i => i.id !== currentChatId);
  delete messages[currentChatId];
  delete chatSettings[currentChatId];
  delete relationshipSettings[currentChatId];

  saveAll();
  hideAllPages();
  document.getElementById('contactPage').style.display = 'block';
  renderAllPanels();
  removeRefsPossiblyUnused(refs);
}

function bindFileInput(id, callback, options = {}) {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    fileToDataURL(file, callback, options);
  });
}

function openStickerImportDialog(mode) {
  currentStickerImportMode = mode;
  showDialog('stickerImportDialog');
}

async function confirmStickerImport() {
  const name = document.getElementById('stickerNameInput')?.value.trim();
  const url = document.getElementById('stickerUrlInput')?.value.trim();
  const fileInput = document.getElementById('stickerFileInput');

  const makeStickerId = () => 's' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

  if (currentStickerImportMode === 'url') {
    if (!url) {
      alert('请输入图片URL');
      return;
    }

    stickerPacks.unshift({
      id: makeStickerId(),
      name: name || '表情',
      src: url
    });

    saveAll();
    renderEmojiPanel();
    closeDialog('stickerImportDialog');
    cleanupUnusedIDBAssets();
    return;
  }

  const files = Array.from(fileInput?.files || []).filter(file => file.type.startsWith('image/'));
  if (!files.length) {
    alert('请上传图片');
    return;
  }

  if (files.length > 20) {
    alert('一次最多导入 20 张表情');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const dataUrl = await new Promise(resolve => {
      fileToDataURL(file, data => resolve(data), {
        compress: true,
        maxWidth: 512,
        quality: 0.72
      });
    });

    const ref = await persistImageToIDB(dataUrl, {
      area: 'sticker.import',
      name: file.name
    });

    stickerPacks.unshift({
      id: makeStickerId(),
      name: files.length === 1 ? (name || '表情') : '表情',
      src: ref
    });
  }

  saveAll();
  renderEmojiPanel();
  closeDialog('stickerImportDialog');
  cleanupUnusedIDBAssets();

  const preview = document.getElementById('stickerImportPreview');
  if (preview) {
    preview.innerHTML = `<span>表情预览区</span>`;
  }

  if (fileInput) fileInput.value = '';
  const nameInput = document.getElementById('stickerNameInput');
  if (nameInput) nameInput.value = '';
  const urlInput = document.getElementById('stickerUrlInput');
  if (urlInput) urlInput.value = '';
}

function initStickerImportPreview() {
  const stickerFileInput = document.getElementById('stickerFileInput');
  const stickerUrlInput = document.getElementById('stickerUrlInput');
  if (!stickerFileInput || !stickerUrlInput) return;

  stickerFileInput.addEventListener('change', e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length > 20) {
      alert('一次最多导入 20 张表情');
      stickerFileInput.value = '';
      return;
    }

    const box = document.getElementById('stickerImportPreview');
    if (!box) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (!imageFiles.length) return;

    const previewFiles = imageFiles.slice(0, 8);

    Promise.all(previewFiles.map(file => new Promise(resolve => {
      fileToDataURL(file, data => resolve(data), {
        compress: true,
        maxWidth: 256,
        quality: 0.72
      });
    }))).then(results => {
      box.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">
          已选择 ${imageFiles.length} 张图片
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          ${results.map(src => `
            <img src="${src}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px;">
          `).join('')}
        </div>
      `;
    });
  });

  stickerUrlInput.addEventListener('input', function () {
    if (currentStickerImportMode !== 'url') return;
    const url = this.value.trim();
    const box = document.getElementById('stickerImportPreview');
    if (!box) return;

    if (!url) {
      box.innerHTML = `<span>表情预览区</span>`;
      return;
    }

    box.innerHTML = `<img src="${url}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
  });
}

function initStickerPanelEvents() {
  const grid = document.getElementById('emojiPanelGrid');
  if (!grid || grid.dataset.bindDelete === '1') return;

  grid.dataset.bindDelete = '1';

  grid.addEventListener('pointerdown', function (e) {
    const btn = e.target.closest('.sticker-delete-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const stickerId = btn.dataset.stickerId;
    if (!stickerId) return;

    deleteStickerById(stickerId, e);
  });
}

function initSendImagePreview() {
  const sendImageInput = document.getElementById('sendImageInput');
  if (!sendImageInput) return;

  sendImageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    fileToDataURL(file, data => {
      currentSendImageData = data;
      const box = document.getElementById('sendImagePreviewBox');
      if (box) {
        box.innerHTML = `<img src="${data}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
      }
    }, {
      compress: true,
      maxWidth: 1000,
      quality: 0.72
    });
  });
}

function initFeedPostImages() {
  const input = document.getElementById('feedPostImages');
  if (!input) return;

  input.addEventListener('change', e => {
    const files = [...e.target.files].slice(0, 9);
    currentFeedImages = [];
    const preview = document.getElementById('feedPostPreview');
    if (!preview) return;

    preview.innerHTML = '';

    if (!files.length) {
      preview.innerHTML = '<span>最多9张图片</span>';
      return;
    }

    let loaded = 0;
    files.forEach(file => {
      fileToDataURL(file, data => {
        currentFeedImages.push(data);
        loaded++;
        if (loaded === files.length) {
          preview.innerHTML = currentFeedImages.map(src => `<img src="${src}" alt="">`).join('');
        }
      }, {
        compress: true,
        maxWidth: 900,
        quality: 0.7
      });
    });
  });
}

function initSwipeCall() {
  const thumb = document.getElementById('swipeThumb');
  const track = document.getElementById('swipeTrack');
  if (!thumb || !track) return;

  let dragging = false;
  let startX = 0;
  let startLeft = 0;

  function getThumbLeftPx() {
    const trackWidth = track.clientWidth;
    const thumbWidth = 44;
    const center = (trackWidth - thumbWidth) / 2;
    const left = thumb.style.left;
    if (!left || left.includes('calc')) return center;
    return parseFloat(left);
  }

  function start(clientX) {
    dragging = true;
    startX = clientX;
    startLeft = getThumbLeftPx();
    thumb.style.transition = 'none';
  }

  function move(clientX) {
    if (!dragging) return;
    const trackRect = track.getBoundingClientRect();
    const thumbWidth = 44;
    const minLeft = 5;
    const maxLeft = trackRect.width - thumbWidth - 5;
    const next = Math.max(minLeft, Math.min(maxLeft, startLeft + (clientX - startX)));
    thumb.style.left = next + 'px';

    const center = (trackRect.width - thumbWidth) / 2;
    thumb.classList.toggle('reject', next < center - 30);
  }

  function end() {
    if (!dragging) return;
    dragging = false;

    const trackRect = track.getBoundingClientRect();
    const thumbWidth = 44;
    const minLeft = 5;
    const maxLeft = trackRect.width - thumbWidth - 5;
    const current = getThumbLeftPx();
    const center = (trackRect.width - thumbWidth) / 2;

    thumb.style.transition = 'left 0.15s ease';

    if (current <= minLeft + 20) {
      rejectIncomingCall();
    } else if (current >= maxLeft - 20) {
      acceptIncomingCall();
    } else {
      thumb.style.left = center + 'px';
      thumb.classList.remove('reject');
    }
  }

  thumb.addEventListener('mousedown', e => start(e.clientX));
  document.addEventListener('mousemove', e => move(e.clientX));
  document.addEventListener('mouseup', end);

  thumb.addEventListener('touchstart', e => start(e.touches[0].clientX));
  document.addEventListener('touchmove', e => move(e.touches[0].clientX), { passive: true });
  document.addEventListener('touchend', end);
}

function maybeSimulateIncomingCall() {
  if (!contactList.length) return;
  if (Math.random() < 0.12) {
    const random = contactList[Math.floor(Math.random() * contactList.length)];
    setTimeout(() => simulateIncomingCall(random.id), 1200);
  }
}

function initEventBindings() {
  document.getElementById('bgOpacity')?.addEventListener('input', updateBgStyle);
  document.getElementById('bgBlur')?.addEventListener('input', updateBgStyle);
  document.getElementById('imageUpload')?.addEventListener('change', handleImageUpload);
    // --- 拦截主页头像上传 ---
  document.getElementById('profileAvatarInput')?.addEventListener('change', async e => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async ev => {
      const dataUrl = ev.target?.result;
      if (!dataUrl) return;

      // 拦截！打开裁剪框，比例 1:1 (头像)
      openCropDialog(dataUrl, 1, async (croppedUrl) => {
        // 裁剪完成后，直接把 DataURL 传给原有的处理函数
        await handleProfileAvatarFile(croppedUrl);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, true); // 清空 input，允许重复选同一张图

  document.addEventListener('click', e => {
    const menu = document.getElementById('operationMenu');
    if (menu && !e.target.closest('#operationMenu') && !e.target.closest('.chat-item')) {
      menu.classList.remove('show');
    }
    const msgMenu = document.getElementById('messageOperationMenu');
    if (msgMenu && !e.target.closest('#messageOperationMenu')) {
      msgMenu.classList.remove('show');
    }
  });

  document.addEventListener('contextmenu', e => {
    if (!e.target.closest('.chat-item') && !e.target.closest('.message-row')) {
      document.getElementById('operationMenu')?.classList.remove('show');
      document.getElementById('messageOperationMenu')?.classList.remove('show');
    }
  });

  document.getElementById('chatInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.getElementById('callInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCallMessage();
    }
  });

  document.getElementById('emojiPanelGrid')?.addEventListener('click', e => {
    if (!stickerManageMode) return;

    const clickedItem = e.target.closest('.emoji-item');
    const clickedDeleteBtn = e.target.closest('.sticker-delete-btn');

    if (!clickedItem && !clickedDeleteBtn) {
      exitStickerManageMode();
    }
  });

  document.getElementById('myAvatarInput')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file || !currentChatId) return;

    const chatId = currentChatId;

    const reader = new FileReader();
    reader.onload = async ev => {
      const data = ev.target?.result;
      if (!data) return;

      // 拦截：打开裁剪框，比例 1:1 (头像)
      openCropDialog(data, 1, async (croppedUrl) => {
        const ref = await persistImageToIDB(croppedUrl, {
          area: 'chat.myAvatar',
          chatId
        });

        if (!ref) {
          alert('头像保存失败，请重试');
          return;
        }

        const setting = getChatSetting(chatId);

        setting.myAvatarBase = ref;

        if (myProfile.avatarUnified) {
          setting.myAvatarOverride = ref;
        }

        saveAll();

        if (currentChatId === chatId && currentChatType === 'direct') {
          await openChatSettingPage();
        }

        renderMessages?.();
        renderChatList?.();
        renderFeedHeader?.();
        renderFeedList?.();
      });
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  });

  bindFileInput('theirAvatarInput', async data => {
    if (!currentChatId) return;
    // 拦截：打开裁剪框，比例 1:1 (头像)
    openCropDialog(data, 1, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, { area: 'chat.theirAvatar', chatId: currentChatId });
      getChatSetting(currentChatId).theirAvatar = ref;
      saveAll();
      openChatSettingPage();
      renderMessages();
      renderChatList();
    });
  }, {
    compress: true,
    maxWidth: 512,
    quality: 0.72
  });

  bindFileInput('chatBgInput', async data => {
    if (!currentChatId) return;

    // 拦截：打开裁剪框，比例 16:9 (背景)
    openCropDialog(data, 9 / 16, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, {
        area: 'chat.background',
        chatId: currentChatId
      });

      if (!ref) {
        alert('背景保存失败，请重试');
        return;
      }

      const setting = getChatSetting(currentChatId);

      setting.backgroundBase = ref;

      if (myProfile.backgroundUnified) {
        setting.backgroundOverride = ref;
      }

      saveAll();
      await openChatSettingPage();
      await applyCurrentChatBackground();
      renderChatList?.();
      renderFeedHeader?.();
      renderFeedList?.();
    });
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });

  bindFileInput('feedCoverInput', async data => {
    // 拦截：打开裁剪框，比例 16:9 (背景)
    openCropDialog(data, 16 / 9, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, { area: 'feed.cover' });
      appProfile.feedCover = ref;
      saveAll();
      renderFeedHeader();
      const cover = document.getElementById('profileCover');
      if (cover) {
        cover.style.backgroundImage = `url(${await resolveImageRefToUrl(ref)})`;
      }
    });
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });

  bindFileInput('globalBgInput', async data => {
    // 拦截：打开裁剪框，比例 16:9 (背景)
    openCropDialog(data, 9 / 16, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, { area: 'profile.globalBg' });

      if (!ref) {
        alert('背景保存失败，请重试');
        return;
      }

      ensureProfileData();
      myProfile.globalChatBg = ref;

      if (myProfile.backgroundUnified) {
        Object.keys(chatSettings).forEach(chatId => {
          const setting = getChatSetting(chatId);
          setting.backgroundOverride = '';
        });
      }

      saveAll();

      await updateProfileUI();
      if (currentChatId) {
        await applyCurrentChatBackground?.();
      }

      renderChatList?.();
      renderFeedHeader?.();
      renderFeedList?.();
      renderGroupList?.();
    });
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });
}

function initVVHostNavigationBridge() {
  window.addEventListener('message', async (event) => {
    const data = event.data || {};
    if (!data || typeof data !== 'object') return;

    const type = String(data.type || '');
    if (!type) return;

    console.log('[VV][NAV] message type =', type, 'data =', data);

    try {
      // ========== 处理电话同步 ==========
      if (type === 'VVPHONE_CALL_SYNC') {
        const raw = String(data.raw || '');
        const chatId = String(data.chatId || '').trim();

        console.log('[VV][NAV] VVPHONE_CALL_SYNC received, raw length =', raw.length, 'chatId =', chatId);

        if (!raw.trim()) {
          console.warn('[VV][NAV] VVPHONE_CALL_SYNC ignored: empty raw');
          return;
        }

        // 防重复
        var dedupKey = 'callsync_' + raw.length + '_' + chatId;
        if (window._lastCallSyncKey === dedupKey && Date.now() - (window._lastCallSyncTime || 0) < 3000) {
          console.log('[VV][NAV] VVPHONE_CALL_SYNC deduplicated, skip');
          return;
        }
        window._lastCallSyncKey = dedupKey;
        window._lastCallSyncTime = Date.now();

        try {
          await handleVVCallSyncRaw({ raw, chatId });
        } catch (err) {
          console.error('[VV][NAV] handleVVCallSyncRaw error:', err);
        }
        return;
      }

      // ========== 处理来电触发 ==========
      if (type === 'VVPHONE_INCOMING_CALL') {
        const raw = String(data.raw || '');
        const viewId = String(data.viewId || '').trim();

        console.log('[VV][NAV] VVPHONE_INCOMING_CALL received');

        if (raw.trim()) {
          try {
            checkForIncomingCallTrigger(raw);
          } catch (err) {
            console.error('[VV][NAV] checkForIncomingCallTrigger error:', err);
          }

          // 也尝试解析 [VV_INCOMING_CALL] 块中的 caller 信息
          try {
            const callerMatch = raw.match(/^\s*caller\s*=\s*(.+)/im);
            const chatIdMatch = raw.match(/^\s*chatId\s*=\s*(.+)/im);
            if (callerMatch) {
              const callerName = callerMatch[1].trim();
              const callChatId = chatIdMatch ? chatIdMatch[1].trim() : '';
              if (callerName) {
                triggerIncomingCallByName(callerName, callChatId);
              }
            }
          } catch (err) {
            console.error('[VV][NAV] parse incoming call block error:', err);
          }
        }
        return;
      }

      // ========== 新增：处理拦截器转发的通话AI回复 ==========
      if (type === 'VV_CALL_AI_REPLY') {
        console.log('[VV][NAV] VV_CALL_AI_REPLY received:', data);
        try {
          // 构建兼容 handleVVCallSyncRaw 的 raw 格式
          if (data.raw) {
            await handleVVCallSyncRaw({ raw: data.raw, chatId: data.chatId || '' });
          } else if (data.messages && data.messages.length > 0) {
            // 如果没有raw但有解析好的messages，手动构建
            const targetName = data.target || '对方';
            const chatId = data.chatId || currentCallId || '';
            let fakeRaw = '[VV_CALL_SYNC]\n';
            fakeRaw += 'chatId=' + chatId + '\n';
            fakeRaw += 'target=' + targetName + '\n';
            fakeRaw += 'callPhase=' + (data.callPhase || 'reply') + '\n';
            fakeRaw += 'time=' + getNowTime() + '\n';
            data.messages.forEach(function(m) {
              fakeRaw += '[通话]\n';
              fakeRaw += 'speaker=' + (m.speaker || targetName) + '\n';
              fakeRaw += 'content=' + (m.content || '') + '\n';
            });
            fakeRaw += '[/VV_CALL_SYNC]';
            await handleVVCallSyncRaw({ raw: fakeRaw, chatId: chatId });
          }
        } catch (err) {
          console.error('[VV][NAV] VV_CALL_AI_REPLY handling error:', err);
        }
        return;
      }

      // ========== 处理聊天同步（从桥接脚本转发过来的） ==========
      if (type === 'VVPHONE_CHAT_SYNC') {
        const raw = String(data.raw || '');
        const chatId = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();

        console.log('[VV][NAV] VVPHONE_CHAT_SYNC received, raw length =', raw.length, 'chatId =', chatId);

        if (!raw.trim()) {
          console.warn('[VV][NAV] VVPHONE_CHAT_SYNC ignored: empty raw');
          return;
        }

        // 如果聊天同步块里也包含电话同步，先处理电话
        if (/\[VV_CALL_SYNC\]/i.test(raw)) {
          console.log('[VV][NAV] VVPHONE_CHAT_SYNC also contains VV_CALL_SYNC, handling call first');
          try {
            await handleVVCallSyncRaw({ raw, chatId });
          } catch (err) {
            console.error('[VV][NAV] handleVVCallSyncRaw from chat sync error:', err);
          }
        }

        // 处理聊天部分
        if (/\[VV_CHAT_SYNC\]/i.test(raw)) {
          try {
            await handleVVChatSyncRaw({ raw, chatId, viewId });
          } catch (err) {
            console.error('[VV][NAV] handleVVChatSyncRaw error:', err);
          }
        }
        return;
      }

      // ========== 处理聊天同步（从桥接脚本转发过来的） ==========
      if (type === 'VVPHONE_CHAT_SYNC') {
        const raw = String(data.raw || '');
        const chatId = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();

        console.log('[VV][NAV] VVPHONE_CHAT_SYNC received, raw length =', raw.length, 'chatId =', chatId);

        if (!raw.trim()) {
          console.warn('[VV][NAV] VVPHONE_CHAT_SYNC ignored: empty raw');
          return;
        }

        if (/\[VV_CALL_SYNC\]/i.test(raw)) {
          console.log('[VV][NAV] VVPHONE_CHAT_SYNC also contains VV_CALL_SYNC, handling call first');
          try {
            await handleVVCallSyncRaw({ raw, chatId });
          } catch (err) {
            console.error('[VV][NAV] handleVVCallSyncRaw from chat sync error:', err);
          }
        }

        if (/\[VV_CHAT_SYNC\]/i.test(raw)) {
          try {
            await handleVVChatSyncRaw({ raw, chatId, viewId });
          } catch (err) {
            console.error('[VV][NAV] handleVVChatSyncRaw error:', err);
          }
        }
        return;
      }

      // ========== 处理日记同步 ==========
      if (type === 'VVPHONE_DIARY_SYNC') {
        const raw = String(data.raw || '');
        const authorId = String(data.authorId || '').trim();

        console.log(
          '[VV][NAV] VVPHONE_DIARY_SYNC received, raw length =',
          raw.length,
          'authorId =',
          authorId
        );

        if (!raw.trim()) {
          console.warn('[VV][NAV] VVPHONE_DIARY_SYNC ignored: empty raw');
          return;
        }

        try {
          await handleVVDiarySyncRaw({
            raw,
            authorId
          });
        } catch (err) {
          console.error('[VV][NAV] handleVVDiarySyncRaw error:', err);
        }

        return;
      }

      // ==================== 标注回复同步监听 ====================
      if (data.type === 'VVPHONE_ANNOTATION_SYNC') {
        console.log('[VV] 收到标注回复同步', data);

        const raw = data.raw || '';
        const diaryId = data.diaryId || '';
        const annotationId = data.annotationId || '';

        if (!raw || !annotationId) {
          console.warn('[VV] 标注回复同步缺少必要字段');
          return;
        }

        handleAnnotationReplySync(raw, diaryId, annotationId);
      }

      // ========== 处理动态同步 ==========
      if (type === 'VVPHONE_FEED_SYNC') {
        const raw = String(data.raw || '');

        console.log('[VV][NAV] VVPHONE_FEED_SYNC received, raw length =', raw.length);

        if (!raw.trim()) {
          console.warn('[VV][NAV] VVPHONE_FEED_SYNC ignored: empty raw');
          return;
        }

        try {
          await handleVVFeedSyncRaw({ raw });
        } catch (err) {
          console.error('[VV][NAV] handleVVFeedSyncRaw error:', err);
        }
        return;
      }

      // ========== 处理原始 AI 回复（兼容直接转发的情况） ==========
      if (type === 'VV_RAW_LLM_REPLY') {
        const raw = String(data.raw || '');
        const chatId = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();

        console.log('[VV][NAV] VV_RAW_LLM_REPLY received, raw length =', raw.length);

        if (!raw.trim()) {
          console.warn('[VV][NAV] VV_RAW_LLM_REPLY ignored: empty raw');
          return;
        }

        // 来电触发
        if (/\[VV_INCOMING_CALL\]/i.test(raw)) {
          console.log('[VV][NAV] detected VV_INCOMING_CALL in raw');
          try {
            checkForIncomingCallTrigger(raw);
          } catch (err) {
            console.error('[VV][NAV] checkForIncomingCallTrigger error:', err);
          }
        }

        // 电话同步
        if (/\[VV_CALL_SYNC\]/i.test(raw)) {
          console.log('[VV][NAV] detected VV_CALL_SYNC, routing to handleVVCallSyncRaw');
          try {
            await handleVVCallSyncRaw({ raw, chatId });
          } catch (err) {
            console.error('[VV][NAV] handleVVCallSyncRaw error:', err);
          }
          // 如果同时有聊天同步，继续处理
          if (!/\[VV_CHAT_SYNC\]/i.test(raw)) return;
        }

        // 聊天同步
        if (/\[VV_CHAT_SYNC\]/i.test(raw)) {
          console.log('[VV][NAV] detected VV_CHAT_SYNC, routing to handleVVChatSyncRaw');
          try {
            await handleVVChatSyncRaw({ raw, chatId, viewId });
          } catch (err) {
            console.error('[VV][NAV] handleVVChatSyncRaw error:', err);
          }
          return;
        }

        // 日记同步
        if (/\[VV_DIARY_SYNC\]/i.test(raw)) {
          console.log('[VV][NAV] detected VV_DIARY_SYNC, routing to handleVVDiarySyncRaw');
          try {
            await handleVVDiarySyncRaw({
              raw,
              authorId: String(data.authorId || '').trim()
            });
          } catch (err) {
            console.error('[VV][NAV] handleVVDiarySyncRaw error:', err);
          }
          return;
        }

        // 动态同步
        if (/\[VV_FEED_SYNC\]/i.test(raw)) {
          console.log('[VV][NAV] detected VV_FEED_SYNC, routing to handleVVFeedSyncRaw');
          try {
            await handleVVFeedSyncRaw({ raw });
          } catch (err) {
            console.error('[VV][NAV] handleVVFeedSyncRaw error:', err);
          }
        }

        // 都不匹配，尝试聊天兜底
        console.log('[VV][NAV] no known sync block in VV_RAW_LLM_REPLY, trying chat fallback');
        try {
          await handleVVChatSyncRaw({ raw, chatId, viewId });
        } catch (err) {
          console.error('[VV][NAV] handleVVChatSyncRaw fallback error:', err);
        }
        return;
      }

      // ========== RP指令：自动发消息 ==========
      if (type === 'VV_RP_SEND_MESSAGE') {
        console.log('[VV][NAV] VV_RP_SEND_MESSAGE received:', data);
        try {
          await handleRPSendMessage(
            String(data.targetName || ''),
            Array.isArray(data.messages) ? data.messages : []
          );
        } catch (err) {
          console.error('[VV][NAV] handleRPSendMessage error:', err);
        }
        return;
      }

      // ========== RP指令：自动打电话 ==========
      if (type === 'VV_RP_MAKE_CALL') {
        console.log('[VV][NAV] VV_RP_MAKE_CALL received:', data);
        try {
          handleRPMakeCall(String(data.targetName || ''));
        } catch (err) {
          console.error('[VV][NAV] handleRPMakeCall error:', err);
        }
        return;
      }

      // ========== 原有的导航处理 ==========
      if (type === 'VVPHONE_SET_VIEW') {
        if (String(data.view || '') !== 'chat') return;

        const chatId = String(data.chatId || data.viewId || '').trim();
        const target = String(data.target || '').trim();
        const chatType = String(data.chatType || 'direct').trim() || 'direct';

        console.log('[VV][NAV] VVPHONE_SET_VIEW -> chat', {
          chatId,
          target,
          chatType
        });

        if (!chatId) {
          console.warn('[VV][NAV] VVPHONE_SET_VIEW ignored: empty chatId');
          return;
        }

        if (chatType === 'direct' && typeof openChatDetail === 'function') {
          await openChatDetail(chatId, target || '');
        } else if (typeof openChat === 'function') {
          await openChat(chatId, chatType);
        }

        return;
      }     

      if (type === 'VV_FEED_HIDDEN_RAW') {
        var raw = data.raw || '';

        if (Date.now() - (window.__VV_LAST_LOCAL_FEED_OPERATION_AT__ || 0) < 5000) {
          console.log('[VV][FEED] skip hidden raw because local feed operation just happened, length =', String(raw).length);
          return;
        }

        if (shouldSkipDuplicateFeedHiddenRaw(raw)) return;

        console.log('[VV][FEED] received raw from host, length =', String(raw).length);
        rebuildFeedPostsFromRaw(raw);
        return;
      }

      // ========== AI 角色主动发布动态 ==========
      if (type === 'VV_AI_FEED_POST') {
        const p = data.payload;
        if (!p || !p.from || !p.content) {
          console.warn('[VV][NAV] VV_AI_FEED_POST: missing required fields');
          return;
        }
        handleAiFeedPost(p);
        return;
      }

      if (type === 'VVPHONE_OPEN_CHAT') {
        const chatId = String(data.chatId || data.viewId || '').trim();
        const target = String(data.target || '').trim();
        const chatType = String(data.chatType || 'direct').trim() || 'direct';

        console.log('[VV][NAV] VVPHONE_OPEN_CHAT', {
          chatId,
          target,
          chatType
        });

        if (!chatId) {
          console.warn('[VV][NAV] VVPHONE_OPEN_CHAT ignored: empty chatId');
          return;
        }

        if (chatType === 'direct' && typeof openChatDetail === 'function') {
          await openChatDetail(chatId, target || '');
        } else if (typeof openChat === 'function') {
          await openChat(chatId, chatType);
        }

        return;
      }
    } catch (err) {
      console.error('[VV][NAV] navigation bridge error:', err);
    }
  });
}

function notifyVVHostReady() {
  try {
    window.parent.postMessage({
      type: 'VVPHONE_READY'
    }, '*');

    console.log('[VV] posted VVPHONE_READY');
  } catch (err) {
    console.warn('[VV] post VVPHONE_READY failed:', err);
  }
}

function migrateFeedPostsAuthorId() {
  const myNames = new Set([
    '我',
    myProfile.nickname || '',
    appProfile.myName || ''
  ].filter(Boolean));

  let changed = false;

  (feedPosts || []).forEach(post => {
    if (!post) return;

    if (!post.authorId && myNames.has(post.author)) {
      post.authorId = 'me';
      changed = true;
    }
  });

  if (changed) {
    saveAll();
  }
}

function getVVRouteParams() {
  try {
    const url = new URL(window.location.href);
    return {
      view: url.searchParams.get('vv_view') || '',
      chatId: url.searchParams.get('chatId') || '',
      chatType: url.searchParams.get('chatType') || 'chat',
      target: url.searchParams.get('target') || ''
    };
  } catch (err) {
    return {
      view: '',
      chatId: '',
      chatType: 'chat',
      target: ''
    };
  }
}

async function openChatByRoute() {
  const route = getVVRouteParams();
  if (route.view !== 'chat') return false;
  if (!route.chatId) return false;

  const chatId = route.chatId;
  const chatType = route.chatType || 'direct';

  if (!messages[chatId]) {
    messages[chatId] = [];
  }

  currentChatId = chatId;
  currentChatType = chatType;

  const rel = getRelSetting(chatId);
  if (route.target && rel && !rel.name) {
    rel.name = route.target;
  }

  const nameEl = document.getElementById('chatDetailName');
  if (nameEl) {
    nameEl.textContent = route.target || (rel && rel.name) || '联系人';
  }

  if (typeof openChatDetail === 'function' && chatType === 'direct') {
    await openChatDetail(chatId, route.target || '');
    return true;
  }

  if (typeof openChat === 'function') {
    await openChat(chatId, chatType);
    return true;
  }

  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

  const page = document.getElementById('chatDetailPage');
  if (page) {
    page.style.display = 'block';
  }

  if (typeof applyCurrentChatBackground === 'function') {
    await applyCurrentChatBackground();
  }

  if (typeof renderMessages === 'function') {
    await renderMessages();
  }

  return true;
}

function openProfileNicknameDialog() {
  const input = document.getElementById('profileNicknameDialogInput');
  if (input) input.value = myProfile.nickname || '我';
  showDialog('profileNicknameDialog');
}

function confirmProfileNicknameChange() {
  const input = document.getElementById('profileNicknameDialogInput');
  if (!input) return;

  setMyProfileNickname(input.value);
  closeDialog('profileNicknameDialog');
}

function normalizeChatSetting(chatId) {
  const id = chatId || currentChatId;
  if (!id) return {};

  if (!chatSettings[id]) {
    chatSettings[id] = {};
  }

  const setting = chatSettings[id];

  if (typeof setting.myAvatarBase === 'undefined' && setting.myAvatar) {
    setting.myAvatarBase = setting.myAvatar;
  }

  if (typeof setting.backgroundBase === 'undefined' && setting.background) {
    setting.backgroundBase = setting.background;
  }

  return setting;
}

function getFeedAuthorAvatar(post) {

  if (!post) {
    return DEFAULT_AVATAR;
  }

  const myNames = new Set([
    '我',
    myProfile?.nickname || '',
    appProfile?.myName || ''
  ].filter(Boolean));

  const isMine =
    post.authorId === 'me' ||
    myNames.has(post.author);

  if (isMine) {
    return (
      getMyProfileAvatar?.()
      || DEFAULT_AVATAR
    );
  }

  if (post.authorId) {
    return getContactAvatarById(
      post.authorId
    );
  }

  if (post.bridgeName) {
    return getContactAvatarByBridge(
      post.bridgeName
    );
  }

  return (
    post.authorAvatar ||
    DEFAULT_AVATAR
  );
}

let _selectedFeedBridge = '';
let _selectedFeedContactId = '';
let _selectedAiFeedBridge = '';
let _selectedAiFeedContactId = '';

function renderAiFeedContactList() {
  const container = document.getElementById('aiFeedContactList');
  if (!container) return;

  _selectedAiFeedBridge = '';
  _selectedAiFeedContactId = '';

  const bridges = getUniqueBridgeNames();

  if (!bridges.length) {
    container.innerHTML = '<div style="padding:12px;color:#999;text-align:center;background:#fff;">暂无已绑定角色</div>';
    return;
  }

  container.innerHTML = bridges.map(b => `
    <div class="ai-feed-bridge-wrap" data-bridge="${escapeHTML(b.bridgeName)}">
      <div class="ai-feed-bridge-item"
           data-bridge="${escapeHTML(b.bridgeName)}"
           style="padding:12px;cursor:pointer;background:#fff;border-bottom:1px solid #e0e0e0;">
        <div style="font-size:14px;background:#fff;">${escapeHTML(b.bridgeName)}</div>
        <div style="font-size:12px;color:#000;margin-top:2px;background:#fff;">${b.count} 个会话</div>
      </div>
      <div class="ai-feed-session-list" style="display:none;background:#fff;"></div>
    </div>
  `).join('');

  container.onclick = function(e) {
    const bridgeItem = e.target.closest('.ai-feed-bridge-item');
    if (bridgeItem) {
      selectAiFeedBridge(bridgeItem.dataset.bridge);
      return;
    }

    const sessionItem = e.target.closest('.ai-feed-session-item');
    if (sessionItem) {
      selectAiFeedSession(sessionItem);
    }
  };
}

function selectAiFeedBridge(bridgeName) {
  _selectedAiFeedBridge = bridgeName;
  _selectedAiFeedContactId = '';

  document.querySelectorAll('.ai-feed-bridge-item').forEach(item => {
    item.style.background = '';
  });

  document.querySelectorAll('.ai-feed-session-list').forEach(box => {
    box.style.display = 'none';
    box.innerHTML = '';
  });

  const wrap = [...document.querySelectorAll('.ai-feed-bridge-wrap')]
    .find(w => w.dataset.bridge === bridgeName);

  if (!wrap) return;

  const bridgeItem = wrap.querySelector('.ai-feed-bridge-item');
  const sessionBox = wrap.querySelector('.ai-feed-session-list');

  if (bridgeItem) bridgeItem.style.background = '#f5f5f5;background:#fff;';
  if (!sessionBox) return;

  const list = contactList.filter(c => c.bridgeName === bridgeName);

  sessionBox.style.display = 'block';
  sessionBox.innerHTML = list.map(contact => {
    const displayName = contact.displayName || contact.name || bridgeName;

    return `
      <div class="ai-feed-session-item"
           data-id="${escapeHTML(contact.id)}"
           style="padding:9px 12px 9px 28px;cursor:pointer;border-bottom: 1px solid #e0e0e0;font-size:14px;background:#fff;">
        ${escapeHTML(displayName)}
      </div>
    `;
  }).join('');
}

function selectAiFeedSession(el) {
  const contactId = el.dataset.id;
  _selectedAiFeedContactId = contactId;

  document.querySelectorAll('.ai-feed-session-item').forEach(item => {
    item.style.background = item.dataset.id === contactId ? '#f5f5f5;background:#fff;' : '';
  });

  console.log('[VV][FEED] selected contact id:', contactId);
}

function selectAiFeedContact(el, contactId) {
  _selectedFeedContactId = contactId;

  document.querySelectorAll('#aiFeedContactList .bridge-list-item')
    .forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
}

function updateContactHeaderByTab(tab) {
  const titleEl = document.getElementById('contactNavTitle');
  const actionEl = document.getElementById('navAction');
  const actionIconEl = document.getElementById('navActionIcon'); // 如果你有的话

  if (tab === 'direct') {
    if (titleEl) titleEl.textContent = '消息';
    if (actionEl) {
      actionEl.style.display = 'flex';
      actionEl.onclick = () => openContactActionMenu?.();
      actionEl.textContent = '＋';
    }
    return;
  }

  if (tab === 'group') {
    if (titleEl) titleEl.textContent = '群聊';
    if (actionEl) {
      actionEl.style.display = 'flex';
      actionEl.onclick = () => openContactActionMenu?.();
      actionEl.textContent = '＋';
    }
    return;
  }

  if (tab === 'feed') {
    if (titleEl) titleEl.textContent = '动态';
    if (actionEl) {
      actionEl.style.display = 'flex';
      actionEl.onclick = () => openPublishFeedDialog?.();
      actionEl.textContent = '＋';
    }
    return;
  }

  if (tab === 'profile') {
    if (titleEl) titleEl.textContent = '我的';
    if (actionEl) {
      actionEl.style.display = 'none';
      actionEl.onclick = null;
    }
  }
}

function openCropDialog(dataUrl, aspectRatio, callback) {
  const dialog = document.getElementById('imageCropDialog');
  const image = document.getElementById('cropTargetImage');

  if (!dialog || !image) return;

  // 记录回调
  cropCallback = callback;

  // 如果有旧的裁剪实例，先销毁
  if (currentCropper) {
    currentCropper.destroy();
    currentCropper = null;
  }

  // 设置图片源并显示弹窗
  image.src = dataUrl;
  dialog.style.display = 'flex';

  // 【关键新增】屏蔽底层所有页面的点击/触摸事件，防止误触触发文件选择
  document.querySelectorAll('.page, .app-container, .tab-bar').forEach(el => {
    el.style.pointerEvents = 'none';
  });

  // 等图片加载完再初始化 Cropper
  image.onload = () => {
    currentCropper = new Cropper(image, {
      aspectRatio: aspectRatio || 1,
      viewMode: 1,
      autoCropArea: 0.8,
      responsive: true,
      background: true,
      zoomable: true,
      movable: true,
    });
  };
}

async function confirmCrop() {
  if (!currentCropper || !cropCallback) {
    closeCropDialog();
    return;
  }

  const isAvatar = currentCropper.options.aspectRatio === 1;
  const maxWidth = isAvatar ? 512 : 1280;

  try {
    const canvas = currentCropper.getCroppedCanvas({
      maxWidth: maxWidth,
      maxHeight: maxWidth,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    if (!canvas) {
      console.error('[Cropper] 裁剪画布生成失败');
      closeCropDialog();
      return;
    }

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

    // 【调试神器】在执行回调前，看看我们要传进去的到底是啥
    console.log('[Cropper] 准备传给回调的数据类型:', typeof croppedDataUrl, '长度:', croppedDataUrl?.length, '前50字符:', String(croppedDataUrl).substring(0, 50));

    // 执行原来的保存回调
    await cropCallback(croppedDataUrl);

    // 【关键修改】只有回调完全执行成功，没有报错，才关闭弹窗！
    closeCropDialog();

  } catch (err) {
    console.error('[Cropper] 裁剪确认时发生错误:', err);
    // 报错了弹窗不关闭，方便你多点几次或者看控制台
  }
}

/**
 * 关闭裁剪弹窗
 */
function closeCropDialog() {
  const dialog = document.getElementById('imageCropDialog');
  if (currentCropper) {
    currentCropper.destroy();
    currentCropper = null;
  }
  cropCallback = null;
  if (dialog) dialog.style.display = 'none';

  // 恢复底层页面的点击/触摸事件
  document.querySelectorAll('.page, .app-container, .tab-bar').forEach(el => {
    el.style.pointerEvents = '';
  });
}

/* ===== 气泡设置功能 ===== */

let currentBubbleTab = 'ai';

let bubbleDraft = {
  ai:   { bgColor: '#ffffff', textColor: '#000000', radius: 18 },
  user: { bgColor: '#0c6cde', textColor: '#ffffff', radius: 18 }
};

// ---------- 默认值 ----------
const DEFAULT_BUBBLE = {
  ai:   { bgColor: '#ffffff', textColor: '#000000', radius: 18 },
  user: { bgColor: '#0c6cde', textColor: '#ffffff', radius: 18 }
};

// ---------- 读取当前会话的气泡设置 ----------
function getBubbleSettings(contactId) {
  const id = contactId || currentChatId;
  if (!id) return JSON.parse(JSON.stringify(DEFAULT_BUBBLE));

  const cs = chatSettings[id];
  if (cs && cs.bubble) {
    // 合并默认值，防止缺字段
    return {
      ai: Object.assign({}, DEFAULT_BUBBLE.ai, cs.bubble.ai || {}),
      user: Object.assign({}, DEFAULT_BUBBLE.user, cs.bubble.user || {})
    };
  }
  return JSON.parse(JSON.stringify(DEFAULT_BUBBLE));
}

// ---------- 保存气泡设置到 chatSettings ----------
function saveBubbleToStorage(contactId, bubbleData) {
  const id = contactId || currentChatId;
  if (!id) return;

  if (!chatSettings[id]) {
    chatSettings[id] = {};
  }
  chatSettings[id].bubble = JSON.parse(JSON.stringify(bubbleData));
  saveAll();
}

// ---------- 打开气泡面板 ----------
function openBubbleSettingPanel() {
  const settings = getBubbleSettings(currentChatId);
  bubbleDraft = JSON.parse(JSON.stringify(settings));
  currentBubbleTab = 'ai';

  updateBubbleTabUI();
  updateBubblePreview();

  document.getElementById('bubbleSettingPanel').style.display = 'flex';
}

// ---------- 关闭面板 ----------
function closeBubbleSettingPanel() {
  document.getElementById('bubbleSettingPanel').style.display = 'none';
}

// ---------- 切换Tab ----------
function switchBubbleTab(tab) {
  currentBubbleTab = tab;
  updateBubbleTabUI();
  updateBubblePreview();
}

// ---------- 更新Tab和控件 ----------
function updateBubbleTabUI() {
  document.querySelectorAll('.bubble-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === currentBubbleTab);
  });

  const data = bubbleDraft[currentBubbleTab];

  document.getElementById('bubbleBgColorPicker').value = data.bgColor;
  document.getElementById('bubbleTextColorPicker').value = data.textColor;
  document.getElementById('bubbleRadiusRange').value = data.radius;
  document.getElementById('bubbleBgHex').textContent = data.bgColor.toUpperCase();
  document.getElementById('bubbleTextHex').textContent = data.textColor.toUpperCase();
  document.getElementById('bubbleRadiusValue').textContent = data.radius + 'px';
}

// ---------- 颜色/圆角变化 ----------
function onBubbleColorChange() {
  const bg = document.getElementById('bubbleBgColorPicker').value;
  const text = document.getElementById('bubbleTextColorPicker').value;
  const radius = parseInt(document.getElementById('bubbleRadiusRange').value);

  bubbleDraft[currentBubbleTab] = { bgColor: bg, textColor: text, radius: radius };

  document.getElementById('bubbleBgHex').textContent = bg.toUpperCase();
  document.getElementById('bubbleTextHex').textContent = text.toUpperCase();
  document.getElementById('bubbleRadiusValue').textContent = radius + 'px';

  updateBubblePreview();
}

// ---------- 更新预览 ----------
function updateBubblePreview() {
  const box = document.getElementById('bubblePreviewBox');
  const data = bubbleDraft[currentBubbleTab];

  box.style.background = data.bgColor;
  box.style.color = data.textColor;
  box.style.borderRadius = data.radius + 'px';
  box.textContent = currentBubbleTab === 'ai' ? '角色预览' : '我的预览';
}

// ---------- 重置 ----------
function resetBubbleSetting() {
  if (!confirm('确定要重置气泡格式为默认吗？')) return;

  bubbleDraft = JSON.parse(JSON.stringify(DEFAULT_BUBBLE));
  updateBubbleTabUI();
  updateBubblePreview();
}

// ---------- 保存 ----------
function saveBubbleSetting() {
  saveBubbleToStorage(currentChatId, bubbleDraft);
  applyBubbleToChat(currentChatId);
  closeBubbleSettingPanel();
}

// ---------- 应用气泡到聊天页 ----------
function applyBubbleToChat(contactId) {
  const settings = getBubbleSettings(contactId);
  const aiS = settings.ai;
  const userS = settings.user;

  // AI气泡
  document.querySelectorAll('.message-row:not(.me) .message-bubble').forEach(el => {
    if (el.classList.contains('sticker-bubble') || el.classList.contains('image-bubble')) return;
    el.style.background = aiS.bgColor;
    el.style.color = aiS.textColor;
    el.style.borderRadius = aiS.radius + 'px';
  });

  // 用户气泡
  document.querySelectorAll('.message-row.me .message-bubble').forEach(el => {
    if (el.classList.contains('sticker-bubble') || el.classList.contains('image-bubble')) return;
    el.style.background = userS.bgColor;
    el.style.color = userS.textColor;
    el.style.borderRadius = userS.radius + 'px';
  });

  // 联动 input-row button
  const sendBtn = document.querySelector('.input-row button');
  if (sendBtn) {
    sendBtn.style.background = userS.bgColor;
    sendBtn.style.color = userS.textColor;
  }
}

// ---------- 给单个新消息应用气泡样式 ----------
function applyBubbleToSingleMessage(msgEl, isUser, contactId) {
  const settings = getBubbleSettings(contactId);
  const s = isUser ? settings.user : settings.ai;
  const bubble = msgEl.querySelector('.message-bubble');

  if (bubble && !bubble.classList.contains('sticker-bubble') && !bubble.classList.contains('image-bubble')) {
    bubble.style.background = s.bgColor;
    bubble.style.color = s.textColor;
    bubble.style.borderRadius = s.radius + 'px';
  }
}

// ========================
// 字体管理系统
// ========================

// 内置字体（不需要字体文件，用系统自带的）
const BUILTIN_FONTS = [
  {
    id: 'default',
    name: '默认字体',
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    preview: '默认系统字体 ABCabc 123'
  },
  {
    id: 'serif',
    name: '衬线宋体',
    family: '"Noto Serif SC", "Songti SC", "SimSun", "Source Han Serif SC", serif',
    preview: '衬线宋体风格 ABCabc 123'
  },
  {
    id: 'kaiti',
    name: '系统楷体',
    family: '"Kaiti SC", "STKaiti", "KaiTi", "楷体", serif',
    preview: '楷体手写风格 ABCabc 123'
  }
];

// 自定义字体存储（保存在 localStorage）
let customFonts = [];
// 当前选中的字体ID
let currentFontId = 'default';

// 初始化字体系统
function initFontSystem() {
  // 读取已保存的自定义字体
  try {
    const saved = localStorage.getItem('vv_custom_fonts');
    if (saved) customFonts = JSON.parse(saved);
  } catch (e) {
    customFonts = [];
  }

  // 读取当前选中字体
  currentFontId = localStorage.getItem('vv_current_font') || 'default';

  // 注册所有已导入的自定义字体
  customFonts.forEach(f => {
    registerFontFace(f.id, f.dataUrl);
  });

  // 应用当前字体
  applyFont(currentFontId);

  // 更新标签显示
  updateFontLabel();
}

// 注册一个 @font-face
function registerFontFace(fontId, dataUrl) {
  const familyName = `CustomFont_${fontId}`;

  // 检查是否已经注册过
  const existingStyle = document.getElementById(`font-style-${fontId}`);
  if (existingStyle) existingStyle.remove();

  const style = document.createElement('style');
  style.id = `font-style-${fontId}`;
  style.textContent = `
    @font-face {
      font-family: "${familyName}";
      src: url("${dataUrl}");
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

// 应用字体到整个手机界面
function applyFont(fontId) {
  currentFontId = fontId;

  let fontFamily = '';

  const builtin = BUILTIN_FONTS.find(f => f.id === fontId);
  if (builtin) {
    fontFamily = builtin.family;
  } else {
    const custom = customFonts.find(f => f.id === fontId);
    if (custom) {
      fontFamily = `"CustomFont_${fontId}", -apple-system, sans-serif`;
    } else {
      fontFamily = BUILTIN_FONTS[0].family;
      currentFontId = 'default';
    }
  }

  document.documentElement.style.setProperty('--vv-current-font', fontFamily);

  document.body.style.fontFamily = fontFamily;

  const phone = document.querySelector('.phone-container');
  if (phone) {
    phone.style.fontFamily = fontFamily;
  }

  document.querySelectorAll('button, input, select, textarea, .dialog, .dialog-content').forEach(el => {
    el.style.fontFamily = fontFamily;
  });

  localStorage.setItem('vv_current_font', currentFontId);

  if (typeof updateFontLabel === 'function') {
    updateFontLabel();
  }
}

// 更新设置页面的字体标签
function updateFontLabel() {
  const label = document.getElementById('currentFontLabel');
  if (!label) return;

  const builtin = BUILTIN_FONTS.find(f => f.id === currentFontId);
  if (builtin) {
    label.textContent = builtin.name;
    return;
  }

  const custom = customFonts.find(f => f.id === currentFontId);
  if (custom) {
    label.textContent = custom.name;
    return;
  }

  label.textContent = '默认字体';
}

// 渲染字体选择列表
function renderFontList() {
  const builtinContainer = document.getElementById('builtinFontList');
  const customContainer = document.getElementById('customFontList');
  const emptyTip = document.getElementById('customFontEmpty');

  // 内置字体
  if (builtinContainer) {
    builtinContainer.innerHTML = BUILTIN_FONTS.map(f => `
      <div class="font-option ${currentFontId === f.id ? 'active' : ''}"
           onclick="playClickSound();applyFont('${f.id}');renderFontList();">
        <div class="font-info">
          <div class="font-name">${f.name}</div>
          <div class="font-preview" style="font-family:${f.family};">${f.preview}</div>
        </div>
        <div class="font-actions">
          ${currentFontId === f.id ? '<span class="font-check">✓</span>' : ''}
        </div>
      </div>
    `).join('');
  }

  // 自定义字体
  if (customContainer) {
    if (customFonts.length === 0) {
      customContainer.innerHTML = '';
      if (emptyTip) emptyTip.style.display = 'block';
    } else {
      if (emptyTip) emptyTip.style.display = 'none';
      customContainer.innerHTML = customFonts.map(f => `
        <div class="font-option ${currentFontId === f.id ? 'active' : ''}"
             onclick="playClickSound();applyFont('${f.id}');renderFontList();">
          <div class="font-info">
            <div class="font-name">${f.name}</div>
            <div class="font-preview" style="font-family:'CustomFont_${f.id}', sans-serif;">
              自定义字体预览 ABCabc 你好世界
            </div>
          </div>
          <div class="font-actions">
            ${currentFontId === f.id ? '<span class="font-check">✓</span>' : ''}
            <button class="font-delete" onclick="event.stopPropagation();playClickSound();deleteCustomFont('${f.id}');">删除</button>
          </div>
        </div>
      `).join('');
    }
  }
}

// 导入自定义字体
function importCustomFont() {
  const nameInput = document.getElementById('importFontName');
  const fileInput = document.getElementById('importFontFile');

  const name = nameInput?.value.trim();
  if (!name) {
    alert('请输入字体名称');
    return;
  }

  const file = fileInput?.files?.[0];
  if (!file) {
    alert('请选择字体文件（支持 .ttf .otf .woff .woff2）');
    return;
  }

  // 检查文件大小（限制 15MB）
  if (file.size > 15 * 1024 * 1024) {
    alert('字体文件过大（超过15MB），请选择更小的文件');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const fontId = 'custom_' + Date.now();

    const fontObj = {
      id: fontId,
      name: name,
      dataUrl: dataUrl,
      addedTime: new Date().toISOString()
    };

    // 注册字体
    registerFontFace(fontId, dataUrl);

    // 保存
    customFonts.push(fontObj);
    saveCustomFonts();

    // 清空输入
    if (nameInput) nameInput.value = '';
    if (fileInput) fileInput.value = '';

    // 自动切换到新字体
    applyFont(fontId);

    // 刷新列表
    renderFontList();

    alert(`字体"${name}"导入成功！`);
  };

  reader.onerror = function() {
    alert('读取字体文件失败，请重试');
  };

  reader.readAsDataURL(file);
}

function getFontFamilyById(fontId) {
  let fontFamily = '';

  // 查找内置字体
  const builtin = BUILTIN_FONTS.find(f => f.id === fontId);

  if (builtin) {
    fontFamily = builtin.family;
    return fontFamily;
  }

  // 查找自定义字体
  const custom = customFonts.find(f => f.id === fontId);

  if (custom) {
    fontFamily = `"CustomFont_${fontId}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    return fontFamily;
  }

  // 找不到，回退默认
  currentFontId = 'default';

  if (BUILTIN_FONTS[0] && BUILTIN_FONTS[0].family) {
    fontFamily = BUILTIN_FONTS[0].family;
  } else {
    fontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  }

  return fontFamily;
}

// 删除自定义字体
function deleteCustomFont(fontId) {
  if (!confirm('确定删除此字体？')) return;

  // 移除 style 标签
  const style = document.getElementById(`font-style-${fontId}`);
  if (style) style.remove();

  // 从列表移除
  customFonts = customFonts.filter(f => f.id !== fontId);
  saveCustomFonts();

  // 如果正在使用这个字体，切回默认
  if (currentFontId === fontId) {
    applyFont('default');
  }

  renderFontList();
}

// 保存自定义字体到 localStorage
function saveCustomFonts() {
  try {
    localStorage.setItem('vv_custom_fonts', JSON.stringify(customFonts));
  } catch (e) {
    // localStorage 可能满了（字体文件比较大）
    console.warn('保存字体失败，可能存储空间不足:', e);
    alert('存储空间不足，无法保存字体。建议删除部分已导入的字体。');
  }
}

function applyCurrentFontTo(root) {
  if (!root) return;

  let fontId = currentFontId || localStorage.getItem('vv_current_font') || 'default';
  let fontFamily = '';

  const builtin = BUILTIN_FONTS.find(f => f.id === fontId);
  if (builtin) {
    fontFamily = builtin.family;
  } else {
    const custom = customFonts.find(f => f.id === fontId);
    if (custom) {
      fontFamily = `"CustomFont_${fontId}", -apple-system, sans-serif`;
    } else {
      fontFamily = BUILTIN_FONTS[0].family;
      fontId = 'default';
    }
  }

  root.style.fontFamily = fontFamily;

  if (root.querySelectorAll) {
    root.querySelectorAll('button, input, select, textarea, h3, label, span, div, p').forEach(el => {
      el.style.fontFamily = fontFamily;
    });
  }
}

// ===================== RP指令辅助函数 =====================

// 通过备注名或角色名查找联系人
function findContactByName(targetName) {
  if (!targetName || !Array.isArray(contactList)) return null;
  targetName = targetName.trim();

  // 1. 精确匹配备注名
  var found = contactList.find(function (c) {
    return (c.displayName || '') === targetName || (c.name || '') === targetName;
  });
  if (found) return found;

  // 2. 精确匹配角色名
  found = contactList.find(function (c) {
    return (c.bridgeName || '') === targetName;
  });
  if (found) return found;

  // 3. 模糊匹配备注名
  found = contactList.find(function (c) {
    var dn = c.displayName || c.name || '';
    return dn && (dn.includes(targetName) || targetName.includes(dn));
  });
  if (found) return found;

  // 4. 模糊匹配角色名
  found = contactList.find(function (c) {
    var bn = c.bridgeName || '';
    return bn && (bn.includes(targetName) || targetName.includes(bn));
  });
  if (found) return found;

  return null;
}

// 处理RP发消息指令
async function handleRPSendMessage(targetName, messageTexts) {
  if (!targetName || !Array.isArray(messageTexts) || messageTexts.length === 0) {
    console.warn('[VV][RP_CMD] handleRPSendMessage: 参数无效', targetName, messageTexts);
    return;
  }

  var contact = findContactByName(targetName);

  if (!contact) {
    console.warn('[VV][RP_CMD] 找不到联系人:', targetName, '，等待AI回复后由同步块创建');
    // ★ 修复：不再自动创建联系人
    // 先临时存储消息，等 handleVVChatSyncRaw 收到同步块后会创建联系人并追加消息
    if (!window._pendingRPMessages) window._pendingRPMessages = {};
    if (!window._pendingRPMessages[targetName]) window._pendingRPMessages[targetName] = [];
    messageTexts.forEach(function (text) {
      if (text && text.trim()) {
        window._pendingRPMessages[targetName].push(text.trim());
      }
    });
    console.log('[VV][RP_CMD] 暂存消息到 _pendingRPMessages:', targetName, window._pendingRPMessages[targetName]);
    return;
  }

  console.log('[VV][RP_CMD] 匹配到联系人:', contact.id, contact.displayName || contact.name);

  // 打开聊天界面
  await openChat(contact.id, contact.threadType || 'direct');

  // 确保消息数组存在
  if (!messages[contact.id]) messages[contact.id] = [];

  var time = getNowTime();
  var timeLabel = getNowFullLabel();

  // 逐条添加用户消息气泡
  messageTexts.forEach(function (text, index) {
    if (!text || !text.trim()) return;
    var trimmed = text.trim();

    // ★ 去重：sendMessage() 已经推过这条气泡，跳过
    var exists = messages[contact.id].some(function(m) {
      if (!m.isMe || m.recalled) return false;
      var oldText = Array.isArray(m.chunks)
        ? m.chunks.join('\n').trim()
        : String(m.text || '').trim();
      return oldText === trimmed;
    });
    if (exists) {
      console.log('[VV][RP_CMD] skipped duplicate:', trimmed);
      return;
    }

    messages[contact.id].push({
      id: 'm' + Date.now() + '_rp_' + index,
      sender: 'me',
      senderName: '我',
      isMe: true,
      type: 'text',
      chunks: [trimmed],
      replyTo: null,
      recalled: false,
      time: time,
      timeLabel: timeLabel,
      pendingForReply: true
    });
  });

  // 更新最后一条消息预览
  var lastText = messageTexts[messageTexts.length - 1];
  if (typeof updateLastMsg === 'function') {
    updateLastMsg(contact.id, lastText, time, contact.threadType || 'direct');
  }

  // 标记等待回复
  if (typeof pendingReplyTargets !== 'undefined') {
    pendingReplyTargets[contact.id] = true;
  }

  // ★ 新增：记录RP消息的chatId，帮助后续同步块匹配
  if (!window._rpChatIdMap) window._rpChatIdMap = {};
  window._rpChatIdMap[targetName] = contact.id;

  // 渲染
  renderMessages();
  if (typeof applyBubbleToChat === 'function') applyBubbleToChat(contact.id);
  saveAll();
  if (typeof renderChatList === 'function') renderChatList();

  // 回传正确的 chatId 和 targetName 给 host，用于 inject
  try {
    window.parent.postMessage({
      type: 'VV_RP_CONTEXT',
      chatId: contact.id,
      targetName: contact.displayName || contact.name
    }, '*');
    console.log('[VV][RP_CMD] sent VV_RP_CONTEXT to host:', contact.id, contact.displayName || contact.name);
  } catch (e) {
    console.warn('[VV][RP_CMD] failed to send VV_RP_CONTEXT:', e);
  }

  console.log('[VV][RP_CMD] 消息已渲染:', messageTexts.length, '条, chatId:', contact.id);
}

// 处理RP打电话指令
function handleRPMakeCall(targetName) {
  if (!targetName) {
    console.warn('[VV][RP_CMD] handleRPMakeCall: targetName为空');
    return;
  }

  var contact = findContactByName(targetName);

  // 找不到就自动创建
  if (!contact) {
    console.warn('[VV][RP_CMD] 找不到联系人:', targetName, '，自动创建');
    var id = 'c' + Date.now();
    var time = getNowTime();
    contact = {
      id: id,
      name: targetName,
      displayName: targetName,
      bridgeName: targetName,
      avatar: DEFAULT_AVATAR,
      isSticky: false,
      lastTime: time,
      threadType: 'direct'
    };
    contactList.unshift(contact);

    if (!messages[id]) {
      messages[id] = [{
        id: 'm' + Date.now(),
        sender: 'system',
        senderName: '系统',
        isMe: false,
        type: 'system',
        chunks: ['已通过电话建立联系'],
        time: time,
        timeLabel: getNowFullLabel()
      }];
    }

    getChatSetting(id);
    getRelSetting(id);
    saveAll();
  }

  console.log('[VV][RP_CMD] 开始拨打电话:', contact.id, contact.displayName || contact.name);

  // 调用现有的拨打电话函数
  simulateOutgoingCall(contact.id);
}

// ===== 主题切换系统 =====

async function switchTheme(themeName, options) {
  options = options || {};

  var theme = phoneThemes[themeName];
  if (!theme) return;

  var switchToken = Date.now() + '_' + Math.random();
  window.__vvThemeSwitchToken = switchToken;

  var oldTheme = localStorage.getItem('st_phone_theme') || 'default';

  var resetWallpaper = !!options.resetWallpaper;
  var resetIcons = !!options.resetIcons;

  localStorage.setItem('st_phone_theme', themeName);

  var iconKeys = [
    'icon-forum',
    'icon-diary',
    'icon-vvshop',
    'icon-vvplatform',
    'icon-contact',
    'icon-text',
    'icon-music',
    'icon-setting'
  ];

  if (oldTheme !== themeName && (resetWallpaper || resetIcons)) {
    var savedIcons = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});

    if (resetWallpaper && savedIcons.wallpaper) {
      delete savedIcons.wallpaper;
    }

    if (resetIcons) {
      for (var i = 0; i < iconKeys.length; i++) {
        delete savedIcons[iconKeys[i]];
      }
    }

    savePhoneIconsSafely(savedIcons);
  }

  var oldHome = document.getElementById('homePage');
  if (oldHome) {
    var temp = document.createElement('div');
    temp.innerHTML = theme.html.trim();
    var newHome = temp.firstElementChild;
    oldHome.parentNode.replaceChild(newHome, oldHome);
  }

  var styleEl = document.getElementById('theme-dynamic-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-dynamic-style';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = theme.css || '';

  // 关键：每次切主题后，先明确应用主题自带背景
  applyThemeWallpaper(themeName);

  if (!resetIcons) {
    await restoreUserIcons();
  }

  // 防止 await 期间已经切到别的主题
  if (window.__vvThemeSwitchToken !== switchToken) return;

  if (!resetWallpaper) {
    await restoreUserWallpaperSafe(themeName, switchToken);
  }

  if (window.__vvThemeSwitchToken !== switchToken) return;

  var savedBorder = localStorage.getItem('st_phone_border_color');
  var savedText = localStorage.getItem('st_phone_text_color');

  if (savedBorder) applyBorderColor(savedBorder);
  if (savedText) applyTextColor(savedText);

  if (typeof updateTime === 'function') updateTime();
  if (typeof updateWeather === 'function') updateWeather();

  var container = document.getElementById('themeListContainer');
  if (container) renderThemeList();
}

function applyThemeWallpaper(themeName) {
  var theme = phoneThemes[themeName] || phoneThemes.default;
  var phone = document.querySelector('.phone-container');
  if (!phone || !theme) return;

  var wallpaper = theme.wallpaper || '';

  if (wallpaper) {
    phone.style.backgroundImage = "url('" + wallpaper + "')";
    phone.style.backgroundSize = 'cover';
    phone.style.backgroundPosition = 'center';
  } else {
    phone.style.backgroundImage = '';
  }
}

async function restoreUserIcons() {
  var saved = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  var iconKeys = ['icon-forum', 'icon-diary', 'icon-vvshop', 'icon-vvplatform',
                  'icon-contact', 'icon-text', 'icon-music', 'icon-setting'];

  for (var i = 0; i < iconKeys.length; i++) {
    var key = iconKeys[i];
    var storedRef = saved[key];
    if (!storedRef) continue;
    try {
      var url = await resolveImageRefToUrl(storedRef);
      if (url) {
        var el = document.getElementById(key);
        if (el) el.src = url;
      }
    } catch (e) {
      console.warn('[restoreUserIcons] 恢复图标失败:', key, e);
    }
  }
}

async function restoreUserWallpaper() {
  var saved = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  var storedRef = saved.wallpaper;
  if (!storedRef) return;

  try {
    var url = await resolveImageRefToUrl(storedRef);
    if (url) {
      var phone = document.querySelector('.phone-container');
      if (phone) {
        phone.style.backgroundImage = `url(${url})`;
      }
    }
  } catch (e) {
    console.warn('[restoreUserWallpaper] 恢复壁纸失败:', e);
  }
}

async function restoreUserWallpaperSafe(themeName, switchToken) {
  var currentTheme = localStorage.getItem('st_phone_theme') || 'default';

  if (currentTheme !== themeName) return;
  if (window.__vvThemeSwitchToken !== switchToken) return;

  var saved = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  var storedRef = saved.wallpaper;

  if (!storedRef) return;

  try {
    var url = await resolveImageRefToUrl(storedRef);

    if (window.__vvThemeSwitchToken !== switchToken) return;

    currentTheme = localStorage.getItem('st_phone_theme') || 'default';
    if (currentTheme !== themeName) return;

    if (url) {
      applyUserWallpaperUrl(url);
    }
  } catch (e) {
    console.warn('[restoreUserWallpaperSafe] 恢复壁纸失败:', e);
  }
}

async function initTheme() {
  var saved = localStorage.getItem('st_phone_theme') || 'default';

  // 初始化主题时不清除用户自定义壁纸和图标
  await switchTheme(saved, {
    resetWallpaper: false,
    resetIcons: false
  });
}

function showThemeDialog() {
  renderThemeList();
  showDialog('themeDialog');
}

function renderThemeList() {
  var container = document.getElementById('themeListContainer');
  if (!container) return;
  var currentTheme = localStorage.getItem('st_phone_theme') || 'default';

  container.innerHTML = '';
  Object.keys(phoneThemes).forEach(function(key) {
    var theme = phoneThemes[key];
    var isActive = key === currentTheme;
    var item = document.createElement('div');
    item.className = 'font-option' + (isActive ? ' active' : '');
    item.innerHTML =
      '<div class="font-info">' +
        '<div class="font-name">' + theme.name + '</div>' +
      '</div>' +
      (isActive ? '<span class="font-check">✓</span>' : '');
    item.onclick = (function(k) {
      return function() {
        playClickSound();

        var currentTheme = localStorage.getItem('st_phone_theme') || 'default';

        if (k === currentTheme) {
          closeDialog('themeDialog');
          return;
        }

        switchTheme(k, {
          resetWallpaper: true,
          resetIcons: true
        });

        closeDialog('themeDialog');
      };
    })(key);
    container.appendChild(item);
  });
}

function requestFeedRefresh() {
  window.parent.postMessage({ type: 'VV_REQUEST_FEED_REFRESH' }, '*');
}

function getSavedPhoneIcons() {
  return safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
}

function savePhoneIconsSafely(data) {
  try {
    localStorage.setItem('st_phone_icons', JSON.stringify(data || {}));
    return true;
  } catch (err) {
    console.warn('[PhoneIcons] save failed:', err);
    return false;
  }
}

//日记函数
function handleAnnotationReplySync(raw) {

  const parsed = parseVVAnnotationBlocks(raw);

  if (!parsed) {
    console.warn(
      '[VV][ANNOTATION] parse failed'
    );
    return false;
  }

  return appendVVAnnotationReplyToLocal(
    parsed
  );
}

function openDiaryChoiceDialog(mode) {
  window.currentDiaryDialogMode = mode || 'view';  
  playClickSound();

  var old = document.getElementById('diaryChoiceDialog');
  if (old) old.remove();

  var phone = document.querySelector('.phone-container') || document.body;

  var dialog = document.createElement('div');
  dialog.id = 'diaryChoiceDialog';
  dialog.className = 'dialog';

  dialog.innerHTML = `
    <div class="dialog-content">
      <h3>日记</h3>

      <div class="diary-mode-list">
        <button class="diary-mode-card" onclick="chooseDiaryMode('ai')">
          <span class="diary-mode-title">AI写日记</span>
        </button>

        <button class="diary-mode-card" onclick="chooseDiaryMode('user')">
          <span class="diary-mode-title">用户写日记</span>
        </button>
      </div>

      <div class="dialog-buttons">
        <button onclick="playClickSound();closeDialog('diaryChoiceDialog')">关闭</button>
      </div>
    </div>
  `;

  phone.appendChild(dialog);

  applySavedDialogBgTo(dialog);
  applyCurrentFontTo(dialog);

  showDialog('diaryChoiceDialog');
}

function chooseDiaryMode(mode) {
  playClickSound();
  closeDialog('diaryChoiceDialog');

  if (mode === 'ai') {

    if (currentDiaryAction === 'write') {
      openAiDiaryWriteRoleDialog();
    } else {
      openAiDiaryRoleDialog();
    }

    return;
  }

  if (mode === 'user') {
    openUserDiaryPage();
    return;
  }
}

function openAiDiaryRoleDialog() {

  playClickSound();

  var old =
    document.getElementById('aiDiaryRoleDialog');

  if (old) {
    showDialog('aiDiaryRoleDialog');
    return;
  }

  var phone =
    document.querySelector('.phone-container')
    || document.body;

  var dialog = document.createElement('div');

  dialog.id = 'aiDiaryRoleDialog';
  dialog.className = 'dialog';

  dialog.innerHTML = `
    <div class="dialog-content ai-diary-dialog">

      <div class="ai-diary-dialog-header">
        <h3>选择角色</h3>
      </div>

      <div class="ai-diary-role-list" style="overflow-y: auto;border: 1px solid rgb(238, 238, 238);border-radius: 8px;margin-top: 4px;background: rgb(255, 255, 255);font-family: &quot;Noto Serif SC&quot;, &quot;Songti SC&quot;, SimSun, &quot;Source Han Serif SC&quot;, serif;"></div>

      <div class="dialog-buttons">
        <button
          onclick="
            playClickSound();
            closeDialog('aiDiaryRoleDialog')
          "
        >
          关闭
        </button>
      </div>

    </div>
  `;

  phone.appendChild(dialog);

  applySavedDialogBgTo(dialog);
  applyCurrentFontTo(dialog);

  renderAiDiaryRoleList();

  showDialog('aiDiaryRoleDialog');
}

function openAiDiaryWriteRoleDialog() {

  playClickSound();

  var old =
    document.getElementById('aiDiaryWriteRoleDialog');

  if (old) {
    renderAiDiaryWriteRoleList();
    showDialog('aiDiaryWriteRoleDialog');
    return;
  }

  var phone =
    document.querySelector('.phone-container')
    || document.body;

  var dialog = document.createElement('div');

  dialog.id = 'aiDiaryWriteRoleDialog';
  dialog.className = 'dialog';

  dialog.innerHTML = `
    <div class="dialog-content ai-diary-dialog">

      <div class="ai-diary-dialog-header">
        <h3>选择写日记角色</h3>
      </div>

      <div id="aiDiaryWriteRoleList" class="ai-diary-write-role-list" style="overflow-y: auto;border: 1px solid rgb(238, 238, 238);border-radius: 8px;margin-top: 4px;background: rgb(255, 255, 255);font-family: &quot;Noto Serif SC&quot;, &quot;Songti SC&quot;, SimSun, &quot;Source Han Serif SC&quot;, serif;"></div>

      <div class="dialog-buttons">
        <button onclick="
          playClickSound();
          closeDialog('aiDiaryWriteRoleDialog');
        ">
          关闭
        </button>
      </div>

    </div>
  `;

  phone.appendChild(dialog);

  applySavedDialogBgTo(dialog);
  applyCurrentFontTo(dialog);

  renderAiDiaryWriteRoleList();

  showDialog('aiDiaryWriteRoleDialog');
}

function renderAiDiaryWriteRoleList() {

  const container =
    document.getElementById('aiDiaryWriteRoleList');

  if (!container) return;

  const groups = groupContactsByBridge();

  let html = '';

  Object.entries(groups).forEach(
    ([bridgeName, contacts]) => {

      // 默认展开
      if (
        typeof diaryExpandedBridges[bridgeName] === 'undefined'
      ) {
        diaryExpandedBridges[bridgeName] = true;
      }

      const expanded =
        diaryExpandedBridges[bridgeName];

      html += `
      <div class="diary-bridge-group">

        <div
          class="diary-bridge-title"
          onclick="
            playClickSound();
            toggleDiaryBridge('${escapeAttr(bridgeName)}');
          "
        >
          <span>${escapeHTML(bridgeName)}</span>
          <span class="diary-bridge-arrow">
            ${expanded ? '⌄' : '›'}
          </span>
        </div>
      `;

      if (expanded) {

        contacts.forEach(contact => {

          const roleName =
            contact.displayName ||
            contact.chatDetailName ||
            contact.name ||
            contact.bridgeName ||
            '未命名';

          const avatarRef =
            getContactAvatarById(contact.id);

          html += `
          <div
            class="ai-diary-role-item"
            onclick="
              playClickSound();
              startAiDiaryDraft('${escapeAttr(contact.id)}');
            "
          >

            <img
              class="ai-diary-role-avatar"
              data-media-ref="${escapeAttr(String(avatarRef || ''))}"
              src="${escapeAttr(DEFAULT_AVATAR || '')}"
              alt="${escapeAttr(roleName)}"
            >

            <div class="ai-diary-role-name">
              ${escapeHTML(roleName)}
            </div>

          </div>
          `;

        });

      }

      html += `</div>`;

    }
  );

  container.innerHTML = html;

  resolveDiaryWriteRoleAvatars(container);
}

function isDefaultOrEmptyAvatarRef(ref) {
  const s = String(ref || '').trim();

  if (!s) return true;

  return (
    s === 'default' ||
    s === 'DEFAULT_AVATAR' ||
    s === 'default_avatar' ||
    s === 'current_target_avatar' ||
    s === String(DEFAULT_AVATAR || '').trim() ||
    s.includes('data:image/svg+xml;base64') ||
    s.includes('default-avatar') ||
    s.includes('placeholder')
  );
}

function resolveDiaryWriteRoleAvatars(container) {

  if (!container) return;

  const imgs =
    container.querySelectorAll(
      'img.ai-diary-role-avatar[data-media-ref]'
    );

  imgs.forEach(async function(img) {

    const ref =
      img.getAttribute('data-media-ref');

    if (!ref) {
      img.src = DEFAULT_AVATAR;
      return;
    }

    try {

      let url = ref;

      if (
        typeof resolveImageRefToUrl === 'function'
      ) {
        url = await resolveImageRefToUrl(ref);
      }

      img.src =
        url ||
        DEFAULT_AVATAR;

    } catch (err) {

      console.warn(
        '[AI_DIARY_AVATAR_RESOLVE_FAIL]',
        ref,
        err
      );

      img.src = DEFAULT_AVATAR;
    }

  });
}

async function startAiDiaryDraft(roleId) {

  console.log(
    '[AI_DIARY_START]',
    roleId
  );

  const contact =
    contactList.find(c => c.id === roleId);

  if (!contact) return;

  const diary = {

    id:
      'diary_' + Date.now(),

    authorId:
      contact.id,

    authorName:
      contact.name,

    title:
      '正在写日记...',

    date:
      new Date().toLocaleDateString(),

    weather:
      '',

    content:
      '请稍候...',

    pending:
      true,

    paragraphs: [],
    annotations: [],
    review: ''
  };

  diaryData.diaries.unshift(diary);

  saveAll();

  // 先打开占位页
  openDiaryPage(roleId);

  // 真正触发AI
  await triggerAiDiaryGenerate(
    roleId,
    diary.id
  );
}

function createPendingAiDiary(contactId) {

  var contact =
    contactList.find(
      c => c.id === contactId
    );

  if (!contact) return;

  var diary = {

    id:
      'diary_' + Date.now(),

    authorId:
      contact.id,

    authorName:
      contact.name,

    title:
      '正在写日记...',

    date:
      new Date().toLocaleDateString(),

    weather:
      '',

    content:
      '请稍候...',

    pending:
      true,

    paragraphs: [],
    annotations: [],
    review: ''
  };

  diaryData.diaries.unshift(diary);

  // 改这里
  saveAll();

  // 你这里还有第二个隐藏问题
  openDiaryPage(contactId);

}

function groupContactsByBridge() {
  const groups = {};

  (contactList || []).forEach(contact => {
    const bridge = contact.bridgeName || contact.name || '未命名角色';

    if (!groups[bridge]) {
      groups[bridge] = [];
    }

    groups[bridge].push(contact);
  });

  return groups;
}

function selectAiDiaryRole(roleId) {

  closeDialog('aiDiaryRoleDialog');

  // AI写日记
  if (currentDiaryAction === 'write') {
    startAiDiaryDraft(roleId);
    return;
  }

  // 查看AI角色日记
  openDiaryPage(roleId);
}

async function triggerAiDiaryGenerate(roleId, diaryId) {

  const contact =
    contactList.find(c => c.id === roleId);

  if (!contact) {
    console.warn('[AI_DIARY] contact not found:', roleId);
    return;
  }

  const bridgeName =
    contact.bridgeName || contact.name || contact.displayName || '角色';

  const authorName =
    contact.displayName || contact.name || bridgeName || '角色';

  const now = new Date();
  const dateText =
    now.getFullYear() + '年' +
    String(now.getMonth() + 1).padStart(2, '0') + '月' +
    String(now.getDate()).padStart(2, '0') + '日';

  const prompt = `【系统指令·AI角色写日记·严格遵守】

你现在要以指定AI角色的身份写一篇私人日记。

写作者信息：
authorId=${roleId}
authorName=${authorName}
bridgeName=${bridgeName}
diaryId=${diaryId}
date=${dateText}

重要要求：
1. 必须以 ${bridgeName} / ${authorName} 的身份写。
2. 日记内容要符合该角色性格、当前剧情、与维夏的关系、最近发生的事。
3. 可以有情绪、隐晦想法、未说出口的话。
4. 禁止写成聊天回复。
5. 禁止写成电话回复。
6. 禁止写成朋友圈动态。
7. 禁止输出解释、分析、旁白。
8. 禁止输出 [VV_CHAT_SYNC]。
9. 禁止输出 [VV_CALL_SYNC]。
10. 禁止输出 [VV_FEED_SYNC]。
11. 禁止输出 [VV_INCOMING_CALL]。
12. 必须且只能输出一个完整的 [VV_DIARY_SYNC] 块。
13. 不要在 [VV_DIARY_SYNC] 前后添加任何多余文字。
14. date 字段必须填写准确日期：${dateText}，禁止写“今天”。

格式必须严格如下：

[VV_DIARY_SYNC]
diaryId=${diaryId}
authorId=${roleId}
authorName=${authorName}
title=这里填写日记标题
date=${dateText}
weather=这里填写天气
paragraph=这里填写第一段日记正文
paragraph=这里填写第二段日记正文
paragraph=这里填写第三段日记正文
[/VV_DIARY_SYNC]`;

  const cmd =
    '/send ' + prompt + '\n|/trigger';

  console.log(
    '[AI_DIARY_CMD]',
    cmd
  );

  const ok =
    await triggerSlash(cmd);

  console.log(
    '[AI_DIARY_RESULT]',
    ok
  );
}

/* ===== 日记页面 - 静态交互 ===== */

// 当前日记状态
var diaryViewState = {
  currentIndex: 0,
  isOnCover: true,
  stickyCollapsed: false,
  viewingRole: 'me' // 'me' 或联系人 id
};
let diaryExpandedBridges = {};

// 打开日记页面（从弹窗选择后调用）
function openDiaryPage(role) {
  diaryViewState.viewingRole = role || 'me';
  diaryViewState.isOnCover = true;
  diaryViewState.currentIndex = 0;

  // 更新选择器标签
  var label = document.getElementById('diarySelectorLabel');
  if (label) {
    label.textContent = role === 'me' ? '我的日记' : getDiaryRoleName(role);
  }

  // 更新封面副标题
  var subtitle = document.getElementById('diaryCoverSubtitle');
  if (subtitle) {
    subtitle.textContent = role === 'me' ? '我的日记' : getDiaryRoleName(role) + '的日记';
  }

  // 显示封面，隐藏正文
  showDiaryCover();

  // 隐藏所有页面，显示日记页
  document.querySelectorAll('.page').forEach(function(p) {
    p.style.display = 'none';
  });

  var diaryPage = document.getElementById('diaryPage');
  if (diaryPage) {
    diaryPage.style.display = 'flex';
  }
}

// 获取指定角色的日记列表
function getDiariesByRole(role) {
  if (!diaryData) diaryData = { diaries: [] };
  if (!diaryData.diaries) diaryData.diaries = [];

  return diaryData.diaries.filter(function(d) {
    if (role === 'me') return !d.authorId || d.authorId === 'me';
    return d.authorId === role;
  });
}

// 获取角色名称
function getDiaryRoleName(role) {

  if (role === 'me') return '我';

  const contact = contactList.find(function(c) {
    return c.id === role;
  });

  if (!contact) return '未知';

  return (
    contact.displayName ||
    contact.name ||
    contact.bridgeName ||
    '未知'
  );
}

function toggleDiaryBridge(bridgeName) {

  diaryExpandedBridges[bridgeName] =
    !diaryExpandedBridges[bridgeName];

  if (
    document.getElementById('aiDiaryWriteRoleList')
  ) {
    renderAiDiaryWriteRoleList();
  }

  if (
    document.querySelector('.ai-diary-role-list')
  ) {
    renderAiDiaryRoleList();
  }
}

async function renderAiDiaryRoleList() {

  const container =
    document.querySelector('.ai-diary-role-list');

  if (!container) return;

  container.innerHTML =
    buildAiDiaryRoleHtml();

  await hydrateMediaRefs(container);
}

function buildAiDiaryRoleHtml() {
  console.log('[buildAiDiaryRoleHtml]执行了');

  var list = [];

  if (
    typeof contactList !== 'undefined' &&
    Array.isArray(contactList)
  ) {
    list = contactList;
  }
  else if (Array.isArray(window.contactList)) {
    list = window.contactList;
  }

  if (!list.length) {
    return `
      <div class="diary-empty-tip">
        还没有可选择的联系人。
      </div>
    `;
  }

  const groups = groupContactsByBridge();

  return Object.keys(groups).map(function(bridgeName) {

    const contacts = groups[bridgeName];

    const expanded =
      !!diaryExpandedBridges[bridgeName];

    const children = expanded
      ? contacts.map(function(contact) {

          const id = contact.id || '';

          const chatName =
            contact.displayName ||
            contact.name ||
            bridgeName;

          const setting =
            normalizeChatSetting(id);

          const avatar =
            getContactAvatarById(id);

          console.log(
            '[头像]',
            chatName,
            avatar
          );

          return `
            <div
              class="ai-diary-chat-item"
              onclick="selectAiDiaryRole('${escapeHTMLAttr(id)}')"
            >

            <div class="ai-diary-role-avatar">
              ${
                avatar
                  ? `<img
                      data-media-ref="${escapeHTMLAttr(String(avatar))}"
                      src="${escapeHTMLAttr(DEFAULT_AVATAR || '')}"
                      alt="${escapeHTMLAttr(chatName)}"
                    >`
                  : `<span>${escapeHTML(chatName.slice(0,1))}</span>`
              }
            </div>

              <div class="ai-diary-role-info">
                <div class="ai-diary-role-name">
                  ${escapeHTML(
                    contact.displayName ||
                    contact.name ||
                    bridgeName
                  )}
                </div>
              </div>

            </div>
          `;

        }).join('')
      : '';

    return `
      <div class="ai-diary-bridge-group">

        <div
          class="ai-diary-bridge-title"
          onclick="toggleDiaryBridge('${escapeHTMLAttr(bridgeName)}')"
        >

          <div class="ai-diary-bridge-left">

            <span class="ai-diary-bridge-name">
              ${escapeHTML(bridgeName)}
            </span>

          </div>

        </div>

        ${
          expanded
            ? `
              <div class="ai-diary-bridge-children">
                ${children}
              </div>
            `
            : ''
        }

      </div>
    `;

  }).join('');
}

// 显示封面
function showDiaryCover() {
  diaryViewState.isOnCover = true;

  var cover = document.getElementById('diaryCover');
  var content = document.getElementById('diaryContentPage');

  if (cover) {
    cover.style.display = 'flex';
    cover.classList.remove('flipped');
  }
  if (content) {
    content.style.display = 'none';
  }

  var delBtn = document.getElementById('diaryDeleteBtn');
  if (delBtn) delBtn.style.display = 'none';
}

// 打开第一页
function openDiaryFirstPage() {
  var diaries = getDiariesByRole(diaryViewState.viewingRole);
  if (!diaries.length) {
    showToast('还没有日记，点击右上角＋新建一篇吧');
    return;
  }
  diaryViewState.currentIndex = 0;
  diaryViewState.isOnCover = false;
  renderDiaryContent();
}

function showToast(msg) {
  var toast = document.createElement('div');
  toast.className = 'vv-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('vv-toast-fade');
    setTimeout(function() { toast.remove(); }, 300);
  }, 2000);
}

function renderDiaryContent() {
  diaryViewState.isOnCover = false;

  var cover = document.getElementById('diaryCover');
  var content = document.getElementById('diaryContentPage');
  if (cover) cover.style.display = 'none';
  if (content) content.style.display = 'flex';

  var delBtn = document.getElementById('diaryDeleteBtn');
  if (delBtn) delBtn.style.display = 'flex';

  var role = diaryViewState.viewingRole || 'me';
  var diaries = getDiariesByRole(role);
  var idx = diaryViewState.currentIndex;

  if (!diaries.length || idx < 0 || idx >= diaries.length) {
    showDiaryCover();
    return;
  }

  var entry = diaries[idx];

  if (!Array.isArray(entry.annotations)) {
    entry.annotations = [];
  }

  var titleEl = document.getElementById('diaryPageTitle');
  if (titleEl) titleEl.textContent = entry.title || '无标题';

  var dateEl = document.getElementById('diaryPageDate');
  if (dateEl) dateEl.textContent = entry.date || '';

  var weatherEl = document.getElementById('diaryPageWeather');
  if (weatherEl) weatherEl.textContent = entry.weather || '';

  var bodyContent = document.getElementById('diaryBodyContent');
  if (bodyContent) {

    var rawParagraphs = [];

    if (entry.paragraphs && entry.paragraphs.length) {
      rawParagraphs = entry.paragraphs;
    }
    else if (entry.content) {
      rawParagraphs = String(entry.content)
        .split(/\n{2,}|\n/)
        .map(function(s) {
          return String(s || '').trim();
        })
        .filter(Boolean);
    }

    var safeParagraphs =
      typeof normalizeDiaryParagraphs === 'function'
        ? normalizeDiaryParagraphs(rawParagraphs)
        : rawParagraphs.map(function(p) {
            if (typeof p === 'string') return p;
            if (p && typeof p === 'object') {
              return String(
                p.text ||
                p.content ||
                p.value ||
                p.paragraph ||
                p.body ||
                ''
              );
            }
            return String(p || '');
          }).filter(Boolean);

    if (safeParagraphs.length) {
      bodyContent.innerHTML = safeParagraphs.map(function(p, i) {

        var count = getDiaryAnnotationCount(entry, i);
        var bubble = '';

        if (count > 0) {
          bubble = '' +
            '<span class="diary-comment-bubble" data-index="' + i + '" ' +
                 'onclick="event.stopImmediatePropagation();playClickSound();showDiaryAnnotationCard(' + i + ', event)">' +
              '<span class="bubble-icon">💬</span>' +
              '<span class="bubble-count">' + count + '</span>' +
            '</span>';
        }

        return '' +
          '<div class="diary-paragraph-wrap" data-index="' + i + '" ' +
               'onpointerdown="diaryParagraphLongPressStart(this, ' + i + ')" ' +
               'onpointerup="diaryParagraphLongPressEnd(this)" ' +
               'onpointerleave="diaryParagraphLongPressEnd(this)">' +
            '<p class="diary-paragraph">' + escapeHTML(p) + bubble + '</p>' +
          '</div>';
      }).join('');
    }
    else {
      bodyContent.innerHTML = '<p class="diary-paragraph diary-empty">（空白日记）</p>';
    }
  }

  var navIndex = document.getElementById('diaryNavIndex');
  if (navIndex) navIndex.textContent = (idx + 1) + ' / ' + diaries.length;

  renderDiaryStickyList(diaries, idx);
}

function getCurrentDiaryEntry() {
  var role = diaryViewState.viewingRole || 'me';
  var diaries = getDiariesByRole(role);
  var idx = diaryViewState.currentIndex;

  if (!diaries || !diaries.length || idx < 0 || idx >= diaries.length) {
    return null;
  }
  return diaries[idx];
}

function getDiaryAnnotationCount(entry, paragraphIndex) {
  if (!entry) return 0;
  if (!Array.isArray(entry.annotations)) entry.annotations = [];
  return entry.annotations.filter(a => Number(a.paragraphIndex) === Number(paragraphIndex)).length;
}

function getDiaryParagraphText(entry, paragraphIndex) {
  if (!entry) return '';
  var rawParagraphs = [];

  if (entry.paragraphs && entry.paragraphs.length) {
    rawParagraphs = entry.paragraphs;
  } else if (entry.content) {
    rawParagraphs = String(entry.content)
      .split(/\n{2,}|\n/)
      .map(s => String(s || '').trim())
      .filter(Boolean);
  }

  var safeParagraphs = typeof normalizeDiaryParagraphs === 'function'
    ? normalizeDiaryParagraphs(rawParagraphs)
    : rawParagraphs.map(p => {
        if (typeof p === 'string') return p;
        if (p && typeof p === 'object') return String(p.text || p.content || p.value || p.paragraph || p.body || '');
        return String(p || '');
      }).filter(Boolean);

  return safeParagraphs[paragraphIndex] || '';
}

// 长按逻辑
let diaryLongPressTimer = null;
let diaryLongPressTriggered = false;

function diaryParagraphLongPressStart(el, paragraphIndex) {
  diaryLongPressTriggered = false;
  clearTimeout(diaryLongPressTimer);

  diaryLongPressTimer = setTimeout(() => {
    diaryLongPressTriggered = true;
    playClickSound();
    openDiaryAnnotationDialog(paragraphIndex);
  }, 580);
}

function diaryParagraphLongPressEnd(el) {
  clearTimeout(diaryLongPressTimer);
}

// ==================== 新增：只读卡片 ====================
let currentAnnotationCard = null;

function showDiaryAnnotationCard(paragraphIndex, evt) {
  if (currentAnnotationCard) currentAnnotationCard.remove();

  var entry = getCurrentDiaryEntry();
  if (!entry) return;

  paragraphIndex = Number(paragraphIndex);
  var annotations = entry.annotations.filter(a => Number(a.paragraphIndex) === paragraphIndex);

  var card = document.createElement('div');
  card.className = 'diary-annotation-card';

  var html = annotations.map(function(a) {

    var repliesHtml = '';

    if (
      Array.isArray(a.replies) &&
      a.replies.length
    ) {
      repliesHtml =
        '<div class="diary-card-replies">' +
        a.replies.map(function(r) {
          return (
            '<div class="diary-card-reply">' +
              '<div class="diary-card-reply-sender">' +
                escapeHTML(r.sender || '') +
              '</div>' +
              '<div class="diary-card-reply-content">' +
                escapeHTML(r.content || '') +
              '</div>' +
            '</div>'
          );
        }).join('') +
        '</div>';
    }

    return (
      '<div class="diary-card-annotation">' +

        '<div class="diary-card-meta">' +
          escapeHTML(
            formatDiaryAnnotationTime(a.createTime)
          ) +
        '</div>' +

        '<div class="diary-card-text">' +
          escapeHTML(a.text || '') +
        '</div>' +

        repliesHtml +

      '</div>'
    );

  }).join('');

  card.innerHTML = html;

  var phone = document.querySelector('.phone-container') || document.body;
  phone.appendChild(card);
  currentAnnotationCard = card;

  var rect = evt.currentTarget.getBoundingClientRect();
  var phoneRect = phone.getBoundingClientRect();

  // 💡 【调整左右距离】
  var offsetX = rect.left - phoneRect.left - 12;

  // 💡 【调整上下距离】
  // 这个数字代表卡片底部离气泡顶部的空隙，数字越大离得越远，-2会让它们非常贴近！
  var offsetY = rect.top - phoneRect.top - card.offsetHeight - 13;

  card.style.left = offsetX + 'px';
  card.style.top = offsetY + 'px';

  // 点击外部关闭
  setTimeout(() => {
    document.addEventListener('click', closeDiaryAnnotationCard, { once: true });
  }, 50);
}

function closeDiaryAnnotationCard() {
  if (currentAnnotationCard) {
    currentAnnotationCard.remove();
    currentAnnotationCard = null;
  }
}

// ==================== 原有功能弹窗 ====================
function openDiaryAnnotationDialog(paragraphIndex) {
  var entry = getCurrentDiaryEntry();
  if (!entry) {
    showToast('没有可标注的日记');
    return;
  }
  if (!Array.isArray(entry.annotations)) entry.annotations = [];

  paragraphIndex = Number(paragraphIndex);
  var paragraphText = getDiaryParagraphText(entry, paragraphIndex);
  var annotations = entry.annotations.filter(a => Number(a.paragraphIndex) === paragraphIndex);

  var old = document.getElementById('diaryAnnotationDialog');
  if (old) old.remove();

  var phone = document.querySelector('.phone-container') || document.body;
  var dialog = document.createElement('div');
  dialog.id = 'diaryAnnotationDialog';
  dialog.className = 'dialog';

  var annotationHtml = annotations.length
    ? annotations.map(a =>
        '<div class="diary-annotation-item">' +
          '<div class="diary-annotation-meta">' + escapeHTML(formatDiaryAnnotationTime(a.createTime)) + '</div>' +
          '<div class="diary-annotation-text">' + escapeHTML(a.text || '') + '</div>' +
          '<button class="diary-annotation-delete" onclick="playClickSound();deleteDiaryAnnotation(\'' + escapeHTMLAttr(a.id) + '\',' + paragraphIndex + ')">删除</button>' +
        '</div>'
      ).join('')
    : '<div class="diary-annotation-empty">还没有标注，写下你的想法吧。</div>';

  dialog.innerHTML = `
    <div class="dialog-content diary-annotation-dialog-content">
      <h3>段落标注</h3>

      <div class="diary-annotation-paragraph-preview">
        ${escapeHTML(paragraphText)}
      </div>

      <div class="diary-annotation-list">
        ${annotationHtml}
      </div>

      <textarea id="diaryAnnotationInput" class="diary-annotation-input" placeholder="给这一段写一点标注……"></textarea>

      <div class="dialog-buttons">
        <button onclick="playClickSound();closeDialog('diaryAnnotationDialog')">关闭</button>
        <button onclick="playClickSound();saveDiaryAnnotation(${paragraphIndex})">保存标注</button>
      </div>
    </div>
  `;

  phone.appendChild(dialog);
  applySavedDialogBgTo(dialog);
  applyCurrentFontTo(dialog);
  showDialog('diaryAnnotationDialog');
}

function saveDiaryAnnotation(paragraphIndex) {
  var entry = getCurrentDiaryEntry();
  if (!entry) {
    showToast('没有可标注的日记');
    return;
  }
  if (!Array.isArray(entry.annotations)) entry.annotations = [];

  var input = document.getElementById('diaryAnnotationInput');
  var text = input ? input.value.trim() : '';

  if (!text) {
    showToast('标注不能为空');
    return;
  }

  var annotation = {
    id: 'anno_' + Date.now() + '_' + Math.random().toString(36).slice(2),
    paragraphIndex: Number(paragraphIndex),
    text: text,
    authorId: 'me',
    authorName: '我',
    createTime: Date.now(),
    updateTime: Date.now()
  };

  entry.annotations.push(annotation);
  entry.updateTime = Date.now();

  saveAll();
  closeDialog('diaryAnnotationDialog');
  renderDiaryContent();

  const wantReply = confirm(
    '标注已保存，是否让角色回复？'
  );

  if (wantReply) {
    triggerDiaryAnnotationReply(
      entry.id,
      annotation.id
    );
    showToast('已请求角色回复');
  } else {
    showToast('仅保存标注');
  }
}

function buildVVAnnotationEvent(diaryId, annotationId) {
  const diary = (diaryData?.diaries || []).find(
    d => String(d.id) === String(diaryId)
  );

  if (!diary) return '';

  const annotation = (diary.annotations || []).find(
    a => String(a.id) === String(annotationId)
  );

  if (!annotation) return '';

  const paragraphText =
    (diary.paragraphs || [])[annotation.paragraphIndex] || '';

  return [
    '[VV_EVENT]',
    'type=annotation',
    'diaryId=' + diary.id,
    'annotationId=' + annotation.id,
    'authorId=' + (diary.authorId || ''),
    'authorName=' + (diary.authorName || ''),
    'paragraphIndex=' + annotation.paragraphIndex,
    'paragraph=' + paragraphText,
    'annotation=' + annotation.text,
    '[/VV_EVENT]',
    '',
    '请针对这条标注进行回复。',
    '如果回复，请使用以下格式：',
    '',
    '[VV_ANNOTATION_SYNC]',
    'diaryId=' + diary.id,
    'annotationId=' + annotation.id,
    '',
    '[回复]',
    'sender=' + (diary.authorName || '角色'),
    'content=回复内容',
    '[/回复]',
    '',
    '[/VV_ANNOTATION_SYNC]'
  ].join('\n');
}

async function triggerDiaryAnnotationReply(
  diaryId,
  annotationId
) {
  try {
    const diary = (diaryData?.diaries || []).find(
      d => String(d.id) === String(diaryId)
    );

    if (!diary) {
      showToast('日记不存在');
      return false;
    }

    const promptText =
      buildVVAnnotationEvent(
        diaryId,
        annotationId
      );

    if (!promptText) {
      showToast('生成标注事件失败');
      return false;
    }

    const bridgeName =
      diary.authorName || '';

    // ★ 恢复使用 buildReplyCommand（/send 版本）
    const cmd =
      VV_BRIDGE_CONFIG.buildReplyCommand({
        bridgeName,
        chatId: diary.authorId || '',
        chatType: 'annotation',
        promptText
      });

    console.log(
      '[VV][ANNOTATION] cmd >>>'
    );
    console.log(cmd);

    const ok = await triggerSlash(cmd, {
      annotationMode: true
    });

    if (ok) {
      showToast('已请求角色回复');
    } else {
      showToast('请求失败');
    }

    return ok;
  } catch (err) {
    console.error(
      '[VV][ANNOTATION] trigger error:',
      err
    );

    showToast('请求异常');
    return false;
  }
}

function parseVVAnnotationBlocks(raw) {
  raw = String(raw || '');

  const blockMatch =
    raw.match(
      /\[VV_ANNOTATION_SYNC\]([\s\S]*?)\[\/VV_ANNOTATION_SYNC\]/i
    );

  if (!blockMatch) return null;

  const block = blockMatch[1];

  const diaryId =
    (block.match(/diaryId=(.+)/i) || [])[1]?.trim() || '';

  const annotationId =
    (block.match(/annotationId=(.+)/i) || [])[1]?.trim() || '';

  const replies = [];

  const replyRegex =
    /\[回复\]([\s\S]*?)\[\/回复\]/gi;

  let match;

  while ((match = replyRegex.exec(block))) {
    const replyBlock = match[1];

    const sender =
      (
        replyBlock.match(/sender=(.+)/i) || []
      )[1]?.trim() || '';

    const content =
      (
        replyBlock.match(/content=([\s\S]*)/i) || []
      )[1]?.trim() || '';

    replies.push({
      sender,
      content
    });
  }

  return {
    diaryId,
    annotationId,
    replies
  };
}

function appendVVAnnotationReplyToLocal(parsed) {
  if (!parsed) return 0;

  const diary =
    (diaryData?.diaries || []).find(
      d => String(d.id) === String(parsed.diaryId)
    );

  if (!diary) {
    console.warn(
      '[VV][ANNOTATION] diary not found:',
      parsed.diaryId
    );
    return 0;
  }

  const annotation =
    (diary.annotations || []).find(
      a =>
        String(a.id) ===
        String(parsed.annotationId)
    );

  if (!annotation) {
    console.warn(
      '[VV][ANNOTATION] annotation not found:',
      parsed.annotationId
    );
    return 0;
  }

  if (!Array.isArray(annotation.replies)) {
    annotation.replies = [];
  }

  let appended = 0;

  parsed.replies.forEach(reply => {
    const syncKey =
      parsed.annotationId +
      '|' +
      reply.sender +
      '|' +
      reply.content;

    const exists =
      annotation.replies.some(
        r => r.syncKey === syncKey
      );

    if (exists) return;

    annotation.replies.push({
      id:
        'reply_' +
        Date.now() +
        '_' +
        Math.random()
          .toString(36)
          .slice(2),

      syncKey,

      sender: reply.sender,
      content: reply.content,

      createTime: Date.now()
    });

    appended++;
  });

  if (appended > 0) {
    diary.updateTime = Date.now();

    saveAll();

    console.log(
      '[VV][ANNOTATION] rerender diary',
      diary.id
    );

    if (typeof renderDiaryContent === 'function') {
      renderDiaryContent();
    }
  }

  console.log(
    '[VV][ANNOTATION] appended:',
    appended
  );

  return appended;
}

function deleteDiaryAnnotation(annotationId, paragraphIndex) {
  var entry = getCurrentDiaryEntry();
  if (!entry || !Array.isArray(entry.annotations)) return;

  entry.annotations = entry.annotations.filter(a => a.id !== annotationId);
  entry.updateTime = Date.now();

  saveAll();
  closeDialog('diaryAnnotationDialog');
  renderDiaryContent();
  showToast('标注已删除');

  setTimeout(() => {
    openDiaryAnnotationDialog(paragraphIndex);
  }, 100);
}

function formatDiaryAnnotationTime(time) {
  if (!time) return '';
  var date = new Date(time);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return y + '年' + m + '月' + d + '日 ' + h + ':' + min;
}

// 渲染右侧便利贴列表
function renderDiaryStickyList(diaries, activeIdx) {
  var container = document.getElementById('diaryStickyItems');
  if (!container) return;

  container.innerHTML = diaries.map(function(d, i) {
    var cls = i === activeIdx ? 'diary-sticky-item active' : 'diary-sticky-item';
    var title = d.title || '无标题';

    return '<div class="' + cls + '" title="' + escapeHTMLAttr(title) + '" onclick="playClickSound();jumpToDiary(' + i + ');">' +
      '<span class="diary-sticky-dot">●</span>' +
      '<span class="diary-sticky-title">' + escapeHTML(title) + '</span>' +
      '</div>';
  }).join('');
}

// 跳转到指定日记
function jumpToDiary(idx) {
  diaryViewState.currentIndex = idx;
  renderDiaryContent();
}

// 上一篇
function prevDiaryEntry() {
  if (diaryViewState.currentIndex > 0) {
    diaryViewState.currentIndex--;
    renderDiaryContent();
  }
}

// 下一篇
function nextDiaryEntry() {
  var diaries = getDiariesByRole(diaryViewState.viewingRole);
  if (diaryViewState.currentIndex < diaries.length - 1) {
    diaryViewState.currentIndex++;
    renderDiaryContent();
  }
}

// 切换便利贴展开/收起
function toggleDiaryStickyList() {
  diaryViewState.stickyCollapsed = !diaryViewState.stickyCollapsed;
  var items = document.getElementById('diaryStickyItems');
  if (items) {
    items.style.display = diaryViewState.stickyCollapsed ? 'none' : 'block';
  }
}

function formatDiaryDate(date) {
  if (!date) date = new Date();

  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();

  return y + '年' + m + '月' + d + '日';
}

function normalizeDiaryParagraphText(p) {
  if (p == null) return '';

  if (typeof p === 'string') {
    return p;
  }

  if (typeof p === 'number' || typeof p === 'boolean') {
    return String(p);
  }

  if (typeof p === 'object') {
    return String(
      p.text ||
      p.content ||
      p.value ||
      p.paragraph ||
      p.body ||
      ''
    );
  }

  return String(p || '');
}

function normalizeDiaryParagraphs(paragraphs) {
  if (!Array.isArray(paragraphs)) return [];

  return paragraphs
    .map(normalizeDiaryParagraphText)
    .map(s => String(s || '').trim())
    .filter(Boolean);
}

// 新建日记
function newDiaryEntry() {
  playClickSound();

  if (!diaryData) {
    diaryData = { diaries: [] };
  }

  if (!Array.isArray(diaryData.diaries)) {
    diaryData.diaries = [];
  }

  var role = diaryViewState.viewingRole || 'me';

  var now = new Date();

  var entry = {
    id: 'diary_' + Date.now(),

    authorId: role,
    authorName: getDiaryRoleName(role),

    title: '未命名日记',

    date: formatDiaryDate(now),

    weather: '',

    content: '',
    paragraphs: [],

    annotations: [],
    review: '',

    createTime: Date.now(),
    updateTime: Date.now()
  };

  diaryData.diaries.unshift(entry);

  diaryViewState.currentIndex = 0;
  diaryViewState.isOnCover = false;

  saveAll();

  renderDiaryContent();

  editDiaryEntry();
}

// 编辑日记
function editDiaryEntry() {
  playClickSound();

  var role = diaryViewState.viewingRole || 'me';
  var idx = diaryViewState.currentIndex;

  var diaries = getDiariesByRole(role);

  if (!diaries || !diaries.length || idx < 0 || idx >= diaries.length) {
    showToast('没有可编辑的日记');
    return;
  }

  var entry = diaries[idx];

  openDiaryEditDialog(entry.id);
}

// 左上角选择器（打开身份切换弹窗）
function openDiarySelector() {
  currentDiaryAction = 'view';
  openDiaryChoiceDialog();
}

// ===== 日记页退出与删除 =====

// 返回按钮点击
function exitDiaryPage() {
  playClickSound();
  document.querySelectorAll('.page').forEach(function(p) {
    p.style.display = 'none';
  });
  var homePage = document.getElementById('homePage');
  if (homePage) homePage.style.display = 'flex';
}

// 删除当前日记
function deleteCurrentDiary() {
  playClickSound();

  var role = diaryViewState.viewingRole || 'me';
  var idx = diaryViewState.currentIndex;

  var diaries = getDiariesByRole(role);

  if (!diaries || !diaries.length || idx < 0 || idx >= diaries.length) {
    return;
  }

  var entry = diaries[idx];
  var title = entry.title || '这篇日记';

  if (!confirm('确定删除「' + title + '」吗？')) {
    return;
  }

  diaryData.diaries = diaryData.diaries.filter(function(d) {
    return d.id !== entry.id;
  });

  saveAll();

  renderDiaryContent();
}

function openDiaryEditDialog(entryId) {
  var entry = diaryData.diaries.find(function(d) {
    return d.id === entryId;
  });

  if (!entry) return;

  var old = document.getElementById('diaryEditDialog');
  if (old) old.remove();

  var phone = document.querySelector('.phone-container') || document.body;

  var dialog = document.createElement('div');
  dialog.id = 'diaryEditDialog';
  dialog.className = 'dialog';

  dialog.innerHTML = `
    <div class="dialog-content diary-edit-dialog-content">
      <h3>编辑日记</h3>

      <div class="diary-edit-form">

        <label class="diary-edit-label">标题</label>
        <input
          id="diaryEditTitle"
          class="diary-edit-input"
          type="text"
          value="${escapeHTMLAttr(entry.title || '')}"
          placeholder="请输入标题"
        >

        <label class="diary-edit-label">日期</label>
        <input
          id="diaryEditDate"
          class="diary-edit-input"
          type="text"
          value="${escapeHTMLAttr(entry.date || '')}"
          placeholder="例如：2025年1月1日"
        >

        <label class="diary-edit-label">天气</label>
        <input
          id="diaryEditWeather"
          class="diary-edit-input"
          type="text"
          value="${escapeHTMLAttr(entry.weather || '')}"
          placeholder="例如：☀️ 晴"
        >

        <label class="diary-edit-label">正文</label>
        <textarea
          id="diaryEditContent"
          class="diary-edit-textarea"
          placeholder="写点什么吧……"
        >${escapeHTML(entry.content || '')}</textarea>

      </div>

      <div class="dialog-buttons">
        <button onclick="playClickSound();closeDialog('diaryEditDialog')">取消</button>
        <button onclick="playClickSound();saveDiaryEdit('${escapeHTMLAttr(entry.id)}')">保存</button>
      </div>
    </div>
  `;

  phone.appendChild(dialog);

  applySavedDialogBgTo(dialog);
  applyCurrentFontTo(dialog);

  showDialog('diaryEditDialog');
}

function saveDiaryEdit(entryId) {
  var entry = diaryData.diaries.find(function(d) {
    return d.id === entryId;
  });

  if (!entry) return;

  var titleEl = document.getElementById('diaryEditTitle');
  var dateEl = document.getElementById('diaryEditDate');
  var weatherEl = document.getElementById('diaryEditWeather');
  var contentEl = document.getElementById('diaryEditContent');

  var title = titleEl ? titleEl.value.trim() : '';
  var date = dateEl ? dateEl.value.trim() : '';
  var weather = weatherEl ? weatherEl.value.trim() : '';
  var content = contentEl ? contentEl.value.trim() : '';

  entry.title = title || '无标题';
  entry.date = date || formatDiaryDate(new Date());
  entry.weather = weather;
  entry.content = content;

  entry.paragraphs = content
    ? content.split(/\n+/).map(function(p) {
        return p.trim();
      }).filter(Boolean)
    : [];

  entry.updateTime = Date.now();

  saveAll();
  closeDialog('diaryEditDialog');
  renderDiaryContent();
  showToast('日记已保存');
}

// 左滑退出手势
function initDiarySwipeGesture() {
  var diaryPage = document.getElementById('diaryPage');
  if (!diaryPage) return;

  var startX = 0;
  var startY = 0;
  var tracking = false;

  diaryPage.addEventListener('touchstart', function(e) {
    var touch = e.touches[0];
    // 只在左边缘30px内开始才算
    if (touch.clientX < 30) {
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    }
  });

  diaryPage.addEventListener('touchmove', function(e) {
    if (!tracking) return;
    var touch = e.touches[0];
    var dx = touch.clientX - startX;
    var dy = Math.abs(touch.clientY - startY);

    // 水平滑动超过80px且角度合理
    if (dx > 80 && dy < 60) {
      tracking = false;
      exitDiaryPage();
    }
  });

  diaryPage.addEventListener('touchend', function() {
    tracking = false;
  });
}

//角色头像
function getContactAvatarById(contactId) {

  if (!contactId) {
    return DEFAULT_AVATAR;
  }

  const contact =
    contactList.find(c => c.id === contactId);

  if (!contact) {
    return DEFAULT_AVATAR;
  }

  const setting =
    normalizeChatSetting(contact.id);

  return (
    setting.theirAvatar ||
    contact.avatar ||
    contact.avatarUrl ||
    contact.icon ||
    DEFAULT_AVATAR
  );
}

function getContactAvatarByBridge(bridgeName) {

  if (!bridgeName) {
    return DEFAULT_AVATAR;
  }

  const contact =
    contactList.find(
      c => c.bridgeName === bridgeName
    );

  if (!contact) {
    return DEFAULT_AVATAR;
  }

  return getContactAvatarById(contact.id);
}

(function initVVFeedClickDelegate() {
  if (window.__VV_FEED_CLICK_DELEGATE_INSTALLED__) return;
  window.__VV_FEED_CLICK_DELEGATE_INSTALLED__ = true;

  document.addEventListener('click', function (event) {
    var btn = event.target && event.target.closest
      ? event.target.closest('[data-feed-action]')
      : null;

    if (!btn) return;

    var action = btn.getAttribute('data-feed-action') || '';
    var postId = btn.getAttribute('data-post-id') || '';
    var commentIndex = btn.getAttribute('data-comment-index') || '';

    console.log('[VV][FEED] delegated click:', action, postId, commentIndex);

    try {
      if (action === 'like') {
        event.preventDefault();
        event.stopPropagation();
        toggleFeedLike(postId);
        return;
      }

      if (action === 'comment') {
        event.preventDefault();
        event.stopPropagation();
        feedQuickComment(postId);
        return;
      }

      if (action === 'reply-comment') {
        event.preventDefault();
        event.stopPropagation();
        replyFeedComment(postId, commentIndex);
        return;
      }

      if (action === 'delete-comment') {
        event.preventDefault();
        event.stopPropagation();
        deleteFeedComment(postId, commentIndex);
        return;
      }

      if (action === 'delete-post') {
        event.preventDefault();
        event.stopPropagation();
        deleteFeedPost(postId);
        return;
      }
    } catch (err) {
      console.warn('[VV][FEED] delegated click failed:', err);
    }
  }, true);

  console.log('[VV][FEED] click delegate installed');
})();

(function exposeVVFeedFunctionsToWindow() {
  try {
    window.toggleFeedLike = toggleFeedLike;
    window.feedQuickComment = feedQuickComment;
    window.replyFeedComment = replyFeedComment;
    window.deleteFeedComment = deleteFeedComment;
    window.deleteFeedPost = deleteFeedPost;
    window.renderFeedList = renderFeedList;

    // 兼容旧名字，避免旧HTML或旧缓存还在找 feedQuickLike
    window.feedQuickLike = toggleFeedLike;

    console.log('[VV][FEED] feed functions exposed to window', {
      toggleFeedLike: typeof window.toggleFeedLike,
      feedQuickComment: typeof window.feedQuickComment,
      replyFeedComment: typeof window.replyFeedComment,
      deleteFeedComment: typeof window.deleteFeedComment,
      deleteFeedPost: typeof window.deleteFeedPost
    });
  } catch (err) {
    console.warn('[VV][FEED] expose feed functions failed:', err);
  }
})();

window.addEventListener('beforeunload', () => {
  releaseAllAssetObjectUrls();
});

//初始化入口函数
window.onload = async function () {
  loadAll();
  initDefaultStickers();

  await convertLegacyImagesToIDB();

  updateRealTime();
  setInterval(updateRealTime, 1000);

  restoreBgStyle();
  initColorPickers();
  await restoreIcons();

  initEventBindings();
  initSendImagePreview();
  initStickerImportPreview();
  initStickerPanelEvents();
  initFeedPostImages();
  initSwipeCall();
  initProfilePage();

  if (!window.__vvHostNavBridgeInited) {
    window.__vvHostNavBridgeInited = true;
    initVVHostNavigationBridge();
  }

  renderAllPanels();
  await renderFeedHeader();
  renderEmojiPanel();

  saveAll('normal');
  cleanupUnusedIDBAssets();

  migrateFeedPostsAuthorId();
  initFontSystem();
  await initTheme(); 

  vvAppReady = true;
  await flushPendingVVChatSyncQueue();

  initDiarySwipeGesture()

  setTimeout(() => {
    flushPendingVVChatSyncQueue();
  }, 120);

  setTimeout(() => {
    flushPendingVVChatSyncQueue();
  }, 300);

  setTimeout(async () => {
    const openedByRoute = await openChatByRoute();
    if (!openedByRoute) {
      await restoreLastChatSession();
    }

    if (!window.__vvHostReadyPosted) {
      window.__vvHostReadyPosted = true;
      notifyVVHostReady();
    }
  }, 80);
};
