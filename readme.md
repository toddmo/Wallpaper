# Random Wallpaper Changer

To have a good wallpaper changer, the `random` function alone doesn't cut it.

I made this app based on my hunch, and I can already tell after 60 seconds that mine is truly delivering the randomness, whereas one of the main trusted apps for Ubuntu... `Variety`... totally was not. 

Have you noticed, with wallpapers or music playlists, the `random` (shuffle) function seems to have a subset of favorites that it leans heavily towards? Worse, whenever these apps restart they completely forget the previous shuffle as well as where they were in that list, so they just start over, picking the same favorites again, never getting to the random function's "unfavorites". People with IQ of 145 or S/O reputation 200k will tell me `random` is fine and it doesn't need fixing, but I'm seeing wallpapers right now that I haven't seen in months (back when the wallpaper folder only had a few files). I think it has to do with bell curves, heuristics, etc., with the choices at the edges of the bell curve barely ever getting picked and those in the middle getting picked constantly. It's more likely to pick a number between 0.3-0.7 than it is 0-0.3 and 0.7-1 combined, even tho that's a larger range.

## Features

 - truly shuffles the files and includes every wallpaper in each round of play, not simply let `random` pick the same files over and over.
 - remembers the shuffle across app restarts, and remembers where it was in that shuffle list.
 - goes thru all the wallpapers, then re-shuffles and repeats, ad infinitum.
 - reshuffles upon image changes within the wallpaper directory
 - reshuffles when you change the wallpaper directory setting in the `config.json`
 - It does nested folders. 
 - It will reshuffle the playlist on each cycle, or on the deletion of the playlist file, or on changes to the wallpaper folder. 

## Limitations

- It doesn't do multiple folders (yet). 
- It has no user interface. 
- It doesn't do multiple monitors:
<pre>
    // sudo apt - get install flatpak
    // flatpak remote - add--if-not - exists flathub https://flathub.org/repo/flathub.flatpakrepo
    // sudo flatpak install flathub org.gabmus.hydrapaper
    // run the GUI flatpak run org.gabmus.hydrapaper or use the CLI hydrapaper - c path_to_wallpaper1 path_to_wallpaper2 ...
</pre>

## Installation

 - [Terminal] Install node.js: 
    ```
    sudo apt-get install nodejs
    ```
 - [Terminal] Install VS Code:
    ```
    sudo apt install code
    ```
 - [VS Code] Open VS Code: 
    ```
    code
    ```
 - [VS Code][Welcome] Clone Git repository: 
    ```
    https://github.com/toddmo/Wallpaper.git
    ```
 - [VS Code][Terminal] Install build dependencies: 
    ```
    npm install
    ```
 - [VS Code][Terminal] Build: 
    ```
    npm run build
    ```
 - [VS Code][config.json] Set your settings in `./dist/config.json`: `wallpaperDirectory` and `intervalMinutes`
 - [VS Code][Terminal] Install PM: 
    ```
    sudo npm install -g pm2
    ```
 - [VS Code][Terminal] Add to pm2: 
    ```
    pm2 start ./dist/src/index.js --name "Wallpaper Changer"
    ```
 - [VS Code][Terminal] save changes to pm2: 
    ```
    pm2 save
    ```
    
