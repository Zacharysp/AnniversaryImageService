# image service workflow

1. single thread, no cluster mode

2. create consumer listen on kafka 'imageService' topic.

3. topic message format
    
    {

        action: resize, //(resize, delete)
        fileName: 13413****.jpg,
    }

4. Resize

* find existed image with imageName
* create low quality preview image with 'imageName_low', and write to gridfs

5. delete existed image with imageName from gridfs

6. if resize and delete fail

* send alert email
* add to fail log