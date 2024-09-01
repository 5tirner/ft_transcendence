#include <iostream>
#include <vector>

using namespace std;

void floodfill(vector<string> &map, int y, int x, char toUpdate, char updateWith)
{
    if (y < 0 || y >= map.size())
    {
        cerr << "BAD Y" << endl;
        return;
    }
    if (x < 0 || x >= map[0].size())
    {
        cerr << "BAD X" << endl;
        return;
    }
    if (map[y][x] != toUpdate)
        return ;
    map[y][x] = updateWith;
    if (y - 1 >= 0)
        floodfill(map, y - 1, x, toUpdate, updateWith);
    if (y + 1 < map.size())
        floodfill(map, y + 1, x, toUpdate, updateWith);
    if (x - 1 >= 0)
        floodfill(map, y, x - 1, toUpdate, updateWith);
    if (x + 1 < map[0].size())
        floodfill(map, y, x + 1, toUpdate, updateWith);
}

int main()
{
    // vector<string> map;
    // map.reserve(10);
    // map.push_back("000000000000000000");
    // map.push_back("000001111111100000");
    // map.push_back("000001000000100000");
    // map.push_back("000001000000100000");
    // map.push_back("000001000000100000");
    // map.push_back("000001000000100000");
    // map.push_back("000001000000100000");
    // map.push_back("000001000000100000");
    // map.push_back("000001111111100000");
    // cout << "Real Map: " << endl;
    // for (int i = 0; i < map.size(); i++)
    //     cout << map[i] << endl;
    // int y = 5, x =  8;
    // char toUpdate = '0';
    // char updateWith = 'F';
    // floodfill(map, 5, 9, '0', 'F');
    // cout << "After Flood Fill Aplyed: " << endl;
    // for (int i = 0; i < map.size(); i++)
    //     cout << map[i] << endl;
    string test = "5 3";
    int i1 = test[0] - 48, i2 = test[2] - 48;
    cout << i1 << ' ' << i2 << endl;
}