import sys
import struct
import zlib

def make_png(width, height, rgba_data):
    # minimal png writer
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    
    raw = b''.join(b'\x00' + rgba_data[y * width * 4:(y + 1) * width * 4] for y in range(height))
    compressed = zlib.compress(raw)
    
    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')
    return header + ihdr + idat + iend

# Create a 200x200 emerald rounded badge with white recycling symbol / circle
width, height = 200, 200
pixels = bytearray(width * height * 4)

# Colors
bg_r, bg_g, bg_b = 4, 120, 87 # #047857 emerald-700
white_r, white_g, white_b = 255, 255, 255

cx, cy, radius = 100, 100, 90
inner_radius = 60

for y in range(height):
    for x in range(width):
        idx = (y * width + x) * 4
        dx = x - cx
        dy = y - cy
        dist = (dx*dx + dy*dy)**0.5
        
        if dist <= radius:
            # Inside outer circle
            if dist >= inner_radius:
                # Emerald border
                pixels[idx] = bg_r
                pixels[idx+1] = bg_g
                pixels[idx+2] = bg_b
                pixels[idx+3] = 255
            else:
                # White inner circle
                # Draw a simple green recycling '♻' approximation or green dot
                # Let's draw a nice green circle inside white
                inner_dot = (dx*dx + dy*dy)**0.5
                if inner_dot <= 35:
                    pixels[idx] = bg_r
                    pixels[idx+1] = bg_g
                    pixels[idx+2] = bg_b
                    pixels[idx+3] = 255
                else:
                    pixels[idx] = white_r
                    pixels[idx+1] = white_g
                    pixels[idx+2] = white_b
                    pixels[idx+3] = 255
        else:
            # Transparent
            pixels[idx] = 0
            pixels[idx+1] = 0
            pixels[idx+2] = 0
            pixels[idx+3] = 0

png_bytes = make_png(width, height, pixels)

for path in [
    'mobile-app/android/app/src/main/res/drawable-mdpi/splashscreen_logo.png',
    'mobile-app/android/app/src/main/res/drawable-hdpi/splashscreen_logo.png',
    'mobile-app/android/app/src/main/res/drawable-xhdpi/splashscreen_logo.png',
    'mobile-app/android/app/src/main/res/drawable-xxhdpi/splashscreen_logo.png',
    'mobile-app/android/app/src/main/res/drawable-xxxhdpi/splashscreen_logo.png'
]:
    with open(path, 'wb') as f:
        f.write(png_bytes)

print('Generated splashscreen_logo.png successfully')
