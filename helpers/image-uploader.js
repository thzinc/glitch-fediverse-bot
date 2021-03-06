var fs = require('fs'),
    bot = require(__dirname + '/../bot.js'),
    NeoCities = require('neocities'),
    use_neocities = false;


if (process.env.NEOCITIES_USERNAME && process.env.NEOCITIES_PASSWORD){
  var neocities_api = new NeoCities(process.env.NEOCITIES_USERNAME, process.env.NEOCITIES_PASSWORD);
  use_neocities = true;
}

module.exports = {
  upload_image: function(img_data, cb){
    var img_url = `${bot.bot_url}/${img_data.path}`,
        img_name = img_data.path.replace('img/', '');
      
    if (use_neocities){
      /*
      First option, NeoCities. They offer 1GB for free, and with a 
      paid option ($5/month) you get 50GB.
      
      https://neocities.org/supporter

      */
      neocities_api.upload([
        {
          name: img_name,
          path: `.data/img/${img_name}`
        }
      ], function(resp) {
        console.log(resp);
        var img_url = null;
        
        if (resp && resp.result === 'success'){
          fs.unlink(`.data/img/${img_name}`, function(err){
            if (err){
              console.log(err);
            }
            else{
              console.log('deleted local image');
            }
          });
          
          img_url = `https://${process.env.NEOCITIES_USERNAME}.neocities.org/${img_name}`;
        }
        if (cb){
          cb(null, img_url, resp);
        }
      });
    } else {
      /* Fall-back to local storage. It's only ~128 MB, so good luck! */
      if (cb){
        cb(null, img_url);
      }
    }
  }
};

