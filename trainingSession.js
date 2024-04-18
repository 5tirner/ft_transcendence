/*Arrays*/
arrayNbrs = [1, 2];
arrayStr = ["1", "2"];
/*Loops*/
for (i in arrayNbrs)
{console.log(arrayNbrs[i]);i++;}
for (i in arrayStr)
{console.log(arrayStr[i]);i++;}
/*Functions*/
function sum(a, b)
{console.log(a + b);}
sum(1,1);
/*Objects*/
player =
{
    FirstName:"Cristiano", LastName:"Ronaldo", Yold:39, Club:"El-Nasser", GoldenBall:5, Nationality:"Portogal",
    Name: function() { return (this.FirstName + this.LastName);},
    Age : function() { return (this.Yold + " Year Old");},
    Team: function() { return (this.Club + " FC Club");},
    NationalTeam: function() { return (this.Nationality + " Team");},
    BallonDOR: function() { return (this.GoldenBall + " Times")},
    describe: function()
    {
        console.log(this.Name());
        console.log(this.Age());
        console.log(this.Team());
        console.log(this.NationalTeam());
        console.log(this.BallonDOR());
    }
};
player.describe();
