# Notification Sound Files

This directory contains the sound files used by the notification system. Replace these placeholder instructions with actual sound files.

## Required Sound Files

The notification system expects the following sound files:

1. `notification.mp3` - Default notification sound
2. `success.mp3` - Success notification sound
3. `error.mp3` - Error notification sound
4. `warning.mp3` - Warning notification sound
5. `message.mp3` - Message notification sound
6. `reminder.mp3` - Reminder notification sound
7. `mention.mp3` - Mention notification sound
8. `like.mp3` - Like/reaction notification sound

## Sound File Specifications

For the best user experience, sound files should:

- Be in MP3 format
- Be between 0.5 and 2 seconds in duration
- Have consistent volume levels
- Be distinctive but not jarring
- Total file size should be under 100KB each

## Sources for Sound Files

You can obtain notification sounds from:

1. Sound effect libraries (ensure they are licensed for your use)
2. Creative Commons sources
3. Professional sound designers
4. Sound effect websites like FreeSound.org

## Implementation Note

If you want to test the system before acquiring final sound files, you can use this command to create blank MP3 files:

```bash
# For Linux/Mac
touch notification.mp3 success.mp3 error.mp3 warning.mp3 message.mp3 reminder.mp3 mention.mp3 like.mp3

# For Windows
New-Item -ItemType File -Path notification.mp3, success.mp3, error.mp3, warning.mp3, message.mp3, reminder.mp3, mention.mp3, like.mp3
```
