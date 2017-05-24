# Usage:
#
# sh cutimage.sh <tileset_image_file> <tile_size_X> <tile_size_y> <output_file_basename> <count_offset_x> <count_offset_y>
#
# Example:
#   sh cutimage.sh tileset.png 32 32 tile
#
# - Will generate tiles of 32x32 named tile0,1.png, tile0,2.png, ..., tile3,5.png
#

# Your tileset file. I've tested with a png file.
origin=$1

# Control variable. Used to name each tile.
counter=0

# The size of the tile (32x32)
tile_size_x=$2
tile_size_y=$3

# Number of rows (horizontal) in the tileset.
rows=$(identify -format %[w] $1)
let rows/=tile_size_x

# Number of columns (vertical) in the tileset.
columns=$(identify -format %[h] $1)
let columns/=tile_size_y

# Tile name prefix.
prefix=$4

# Character between coordinates
infix=,

# Tile name sufix.
sufix=.png

echo Extracting $((rows * $columns)) tiles...

for i in $(seq 0 $((columns - 1))); do

    for j in $(seq 0 $((rows - 1))); do

        # Calculate next cut offset.
        offset_y=$((i * tile_size_y))
        offset_x=$((j * tile_size_x))

        # Update naming variable.
        counter=$((counter + 1))

        tile_name=$prefix$((j))$infix$((i))$sufix

        echo convert -extract $tile_size"x"$tile_size"+"$offset_x"+"$offset_y $origin $tile_name
        convert -extract $tile_size_x"x"$tile_size_y"+"$offset_x"+"$offset_y $origin $tile_name
    done
done
echo Done!