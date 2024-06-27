export const stylesheet = `
#profile-page {
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3.6rem !important;
}
#first {
    border: solid 1px rgb(100 100 100 / .5)!important;
    border-radius: 18px;
    width: 100%;
    height: 30%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 20px;
}
.common {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    font-size: 10px;
    padding-bottom: 40px;
}
.win {
    flex-grow: 2;
    flex-basis: 2%}
.user {
    flex: 4;
    flex-basis: 8%}
.avatar {
    width: 100%;
    text-align: center;
}
div img {
    width: 150px;
    height: 150px;
    border: solid 2px rgb(200 200 200 / .75)!important;
    border-radius: 50%;
    background: rgb(100 100 100 / .75);
}
.info {
    width: 100%;
    padding-top: 20px;
    text-align: center;
}
.info:last-child {
    color: rgb(200 200 200 / .75);
    font-size: 8px;
}
.loss {
  flex-grow: 2;
  flex-basis: 2%}
  
  #second {
    border: solid 1px rgb(100 100 100 / .5) !important;
    border-radius: 18px;
    width: 100%;
    height: 60%;
    overflow: hidden;
    overflow-y:  scroll;
    scrollbar-width: thin;
    scrollbar-color: rgb(255 255 255 / .2) rgb(100 100 100 / .1);
    }
    
  .wrapper {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
  }
  #second::-webkit-scrollbar
  {
    position: absolute !important;
    width: 5px;
    background-color: rgb(100 100 100 / .1);
}
    
#second::-webkit-scrollbar-track
{
    height: 10px;
    -webkit-box-shadow: inset 0 0 6px rgb(100 100 100 / .1) ;
    border-radius: 10px;
    // background-color: #f8bbd0  ;
    
    // Add Border on Track
    // border-left: 3px solid white;
    // border-right: 3px solid white;
}
    
  #second::-webkit-scrollbar-thumb
  {
        height: 10%;
  border-radius: 20px;
  -webkit-box-shadow: inset 0 0 px #ad1457 ;
  background-color: #e91e63;

}


p {
  font-size: 16px;
  margin: 20px 0;
  text-align: center;
}

.responsive-table {
  li {
    border-radius: 3px;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }
  .table-row {
    border: solid 1px rgb(150 150 150 / .5) !important;
    border-radius: 18px;
  }
  .col-1 {
    flex-basis: 10%;
  }
  .col-2 {
    flex-basis: 40%;
  }
  .col-3 {
    flex-basis: 25%;
  }
  .col-4 {
    flex-basis: 25%;
  }
  
  @media all and (max-width: 767px) {
    .table-header {
      display: none;
    }
    .table-row{
      
    }
    li {
      display: block;
    }
    .col {
      
      flex-basis: 100%;
    }
    .col {
      display: flex;
      padding: 10px 0;
      &:before {
        color: #6C7A89;
        padding-right: 10px;
        content: attr(data-label);
        flex-basis: 50%;
        text-align: right;
      }
    }
  }
}







`;