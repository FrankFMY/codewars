public class BattleField {
        
    private static int xy(int[][] arr, int x, int y) {
      return (x < 0 || x >= arr[0].length || y < 0 || y >= arr.length) ? 0 : arr[y][x];
    }
    
    public static boolean fieldValidator(int[][] f) {
    
        // Validate the ship's surroundings
        // --------------------------------
        for (int y = 0; y < f.length; y++) {
          for (int x = 0; x < f[y].length; x++) {
          
            if (xy(f, x, y) == 1) {
              // Cannot allow a mix of horizontal and vertical
              final boolean v = xy(f, x, y-1) != 0 || xy(f, x, y+1) != 0; // look up/down
              final boolean h = xy(f, x-1, y) != 0 || xy(f, x+1, y) != 0; // look left/right
              if (h && v) return false;
              if (v) f[y][x] = -1; // using -1 to represent "vertical" ships
            
              // Cannot be anything diagonally adjacent this cell
              if (xy(f, x-1, y-1) != 0 || xy(f, x+1, y-1) != 0 || xy(f, x+1, y+1) != 0 || xy(f, x-1, y+1) != 0) return false;
            }
          }
        }
        
        // Count ships of various expected lengths
        // ---------------------------------------
        final int[] shipCounts = {0, 4, 3, 2, 1};
        // horizontal ships
        for (int y = 0; y < f.length; y++) {
          for (int x = 0; x < f[y].length; x++) {
            if (xy(f, x, y) == 1) {
              int len = 1;
              while (xy(f, ++x, y) == 1) len++;
              if (len > 4) return false; // ship too big
              shipCounts[len]--;
            }
          }
        }
        // vertical ships
        for (int x = 0; x < f[0].length; x++) {
          for (int y = 0; y < f.length; y++) {
            if (xy(f, x, y) == -1) {
              int len = 1;
              while (xy(f, x, ++y) == -1) len++;
              if (len > 4) return false; // ship too big
              shipCounts[len]--;
            }
          }
        }        
        // Check expected ship counts
        for (int count : shipCounts) if (count != 0) return false;
        return true;
    }
}