Unfortunately, the `random` function alone doesn't cut it.

I just launched a random wallpaper app that I made based on my hunch, and I can already tell after 60 seconds that mine is truly delivering the randomness, whereas one of the main trusted apps for Ubuntu... `Variety`... totally was not. 

Have you noticed, with wallpapers or music playlists, the `random` (shuffle) function seems to have a subset of favorites that it leans heavily towards? Worse, whenever these apps restart they completely forget the previous shuffle as well as where they were in that list, so they just start over, picking the same favorites again, never getting to the random function's "unfavorites". People with IQ of 145 or reputation 200k will tell me `random` is fine and it doesn't need fixing, but I'm seeing wallpapers right now that I haven't seen in months (back when the wallpaper folder only had a few files). I think it has to do with bell curves, heuristics, etc., with the choices at the edges of the bell curve barely ever getting picked and those in the middle getting picked constantly. It's more likely to pick a number between 0.3-0.7 than it is 0-0.3 and 0.7-1 combined, even tho that's a larger range.

So I wrote an app to force it to truly shuffle the files and include every wallpaper in each shuffle, not simply let `random` pick the same files over and over. Then remember the shuffle across app restarts, and remember where it was in that shuffle list. It goes thru all the wallpapers, then re-shuffles and repeats, ad infinitum.

It will pick up new files on each cycle, or on the deletion of the playlist file, or on changes to the wallpaper folder. It doesn't do multiple or nested folders (yet).

 1. [Terminal] Install node.js: `sudo apt-get install nodejs`
 1. [Terminal] Create project folder: `mkdir Wallpaper`
 1. [VS Code] Open VS Code
 1. [VS Code][Welcome] Clone Git repository: [https://github.com/toddmo/Wallpaper][1]
 1. [VS Code][config.json] Set your settings: `wallpaperDirectory` and `intervalMinutes`
 1. [VS Code][Terminal] Build: `npm run build`
 1. [VS Code][Terminal] Install PM: `sudo npm install -g pm2`
 1. [VS Code][Terminal] Add to pm2: `pm2 start ./Wallpaper/dist/src/app.js --name "Wallpaper Changer"`
 1. [VS Code][Terminal] save changes to pm2: `pm2 save`


  [1]: https://github.com/toddmo/Wallpaper