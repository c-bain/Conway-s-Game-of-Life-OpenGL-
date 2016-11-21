//opengl cross platform includes
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <unistd.h>

#ifdef __APPLE__
#  include <OpenGL/gl.h>
#  include <OpenGL/glu.h>
#  include <GLUT/glut.h>
#else
#  include <GL/gl.h>
#  include <GL/glu.h>
#  include <GL/freeglut.h>
#endif

int main_id;
int subMenu_id;
int subMenu_id2;
int size;//size of grid //set to 60 
int **status; //0 means cell is dead, 1 means alive 
int **statusNew; //0 means cell is dead, 1 means alive
int speed=100000;//current speed
int speedup=1;//speed levels
int nCount=0;
int liveCells=0; //number of live cells on grid 
bool clear = false;
bool pauseGame=false;
bool randomize=false;
void cellAlive(int x,int y);//creates a cell at an x,y coord
void drawGrid();//draws the lines of the grid 


void FPS(int val){
	glutPostRedisplay();
	glutTimerFunc(300, FPS, 0); // 1sec = 1000, 60fps = 1000/60 = ~17
}



int randomNum(){//random number between 1 and N-1
  int num=rand()%(size-2);
  num+=1;
  return num;
}

void drawCellsInitial(){//intially spawns a few cells to grid 
	srand (time(NULL));
	for(int cellX=0;cellX<size;cellX++){
			for(int cellY=0;cellY<size;cellY++){
				statusNew[cellX][cellY]=0;
				if((rand()%2)==1){//if a live cell found then draw it
					status[cellX][cellY]=0;
				}
				else{
					status[cellX][cellY]=1;
				}
			}
	}
}

void clickFunc(int x, int y){//handles the alternating of cells after user clicks
	for (int i =0;i<size-1;i++){
		for(int j=0;j<size-1;j++){
			int scalef=12;int scalef1=2;int scalef2=57;int scalef3=1;//scale factors//scalef1=size of a square
			if((float)(i+scalef1)*scalef>x && (float)(i+scalef3)*scalef<x){
				if((float)(j+scalef1)*scalef>y && (float)(j+scalef3)*scalef<y ){
					if (statusNew[i+scalef1][scalef2-j]==0){statusNew[i+scalef1][scalef2-j]=1;}//if cell off turn it on
					else{statusNew[i+scalef1][scalef2-j]=0;} //if cell on turn it off
				}
			}
		}
	}

}

void mouse(int btn, int state, int x, int y){//placement of cells on grid by user 
	if (btn == GLUT_LEFT_BUTTON){
		if (state == GLUT_UP){
				printf("%s\n","Alternating cell...");
				clickFunc(x,y);
			}
	}
}



void keyb(unsigned char k, int x, int y)
{
	
	if(k == 'q' || k == 'Q')//menu options
	{
		printf("%s\n","	Thanks for Playing!\n" );
		exit(0);
	}
	if(k == 'c' || k == 'C')
	{
		clear=!clear;
		printf("%s\n","	 Grid Cleared......." );

	}
	if(k == 'p' || k == 'P')
	{
		pauseGame=!pauseGame;
		printf("%s\n","	 Pause / Run......." );

	}
	if(k == 'r' || k == 'R')
	{
		randomize=!randomize;
		printf("%s\n","	 Refreshing and Randomizing......." );

	}
	if(k == 's' || k == 'S')
	{	
		if(speedup==4){//reset
			speedup=1;
			printf("%s\n","  Normal Speed(Default)");
		}
		else{
			speedup+=1;
			printf("%s\n","	 Slowing down......." );
		}
	}
}

void drawGrid(){//draws the grid initially without any cells present
	glPointSize(1.0);
	glColor3f(0,0,1);
	glBegin(GL_LINES);
		for(int i=0;i<size;i++){
				glVertex2f(0,i+1);
				glVertex2f(size,i+1);
				glVertex2f(i+1,0);
				glVertex2f(i+1,size);
		}
	glEnd();	
		
	}

int checkNeighbours(int nCount,int cellX, int cellY){//checks left,right,bottom,top. 1 represents alive, 0 represents dead.1
	nCount=0;
	if(status[cellX-1][cellY]==1){nCount++;}//check left
	if(status[cellX+1][cellY]==1){nCount++;}//check right
	if(status[cellX][cellY-1]==1){nCount++;}//check down
	if(status[cellX][cellY+1]==1){nCount++;}//check up
	if(status[cellX-1][cellY+1]==1){nCount++;}//diag
	if(status[cellX+1][cellY+1]==1){nCount++;}//diag
	if(status[cellX-1][cellY-1]==1){nCount++;}//diag
	if(status[cellX+1][cellY-1]==1){nCount++;}//diag

	return nCount;
}

//creates a new green cell 
void cellAlive(int x,int y){
		glBegin(GL_POLYGON);
		glColor3f(0,1,0);
		glVertex2f(x,y);
		glVertex2f(x+1,y);
		glVertex2f(x+1,y+1);
		glVertex2f(x,y+1);
		glEnd();

}

//clears the grid of all live cells
void clearBoard(){
	for(int cellX=0;cellX<size;cellX++){
		for(int cellY=0;cellY<size;cellY++){
			status[cellX][cellY]=0;
			statusNew[cellX][cellY]=0;
		}
	}
}

//finds cells that are alive
void drawCells(){
		for(int i=0;i<size;i++){
			for(int j=0;j<size;j++){
				if((status[i][j])==1){//if a live cell found then draw it
					cellAlive(i,j);
				}
			}
		}
}

//rules of the game are used to set values to coordinates. 1 is alive, 0 is dead
void rules(){
		usleep(speed);
		for(int cellX=1;cellX<size-1;cellX++){
			for(int cellY=1;cellY<size-1;cellY++){
				int n=checkNeighbours(nCount,cellX,cellY);
				if(n==3 && (status[cellX][cellY]==0)){//new cell spawns
					statusNew[cellX][cellY]=1;
					liveCells++;
				}else if( (n==2 && (status[cellX][cellY]==1)) || (n==3 && (status[cellX][cellY]==1)) ){//lives on to next generation
					statusNew[cellX][cellY]=1;
				}else if(n<2 && (status[cellX][cellY]==1)){//cell dies by underpopulation
					statusNew[cellX][cellY]=0;
					liveCells--;
				}else if(n>3 && (status[cellX][cellY]==1)){//cell dies by overcrowding
					statusNew[cellX][cellY]=0;
					liveCells--;
				}
			}
		}
		
		for(int i=0;i<size;i++){//copies new to old based on rules of the game 
			for(int j=0;j<size;j++){
				status[i][j]=statusNew[i][j];
			}
		}
}

void display(void)
{
		if(pauseGame==false){
			glClearColor(1,1,0,0);
			glClear(GL_COLOR_BUFFER_BIT);
			drawGrid();//draws grid lines only 
			rules();//rules of Conway
			drawCells();//redraws board with all new cells
			drawGrid();
			glFlush();
		}if(clear==true){
			clearBoard();	
		}if( randomize==true ){
			drawCellsInitial();
			randomize=!randomize;
			clear=false;
			glFlush();		
		}if(speedup==1){speed=100000;} //speed control(normal)
		else if(speedup==1){speed=100000;}//slower
		else if(speedup==2){speed=400000;}//"" 
		else if(speedup==3){speed=800000;}//""
		else if(speedup==4){speed=2000000;}//slower

}

/* main function - program entry point */
int main(int argc, char** argv)
{
	printf("\n%s\n","     	    Welcome!" );
	printf("\n%s\n","---Press c to clear the grid\n" );
	printf("%s\n","---Press r to refresh and randomize the grid\n" );
	printf("%s\n","---Press p to pause/run the program\n" );
	printf("%s\n","---Press s for speed control: Normal(Default)->Slower->Slower->Slower->Normal\n" );
	printf("%s\n","---Click on the grid to alternate cells\n" );
	printf("%s\n","---Press q to quit the program\n" );
	size=61;
	status = (int **)malloc(size*sizeof(int *));//dynamic allocation of the status array.
	statusNew = (int **)malloc(size*sizeof(int *));//dynamic allocation of the status array.
	for(int i=0;i<size;i++){
		status[i] = (int *)malloc(size*sizeof(int));
		statusNew[i] = (int *)malloc(size*sizeof(int));
	}
	drawCellsInitial();//set down a few live cells in the beginning
	glutInit(&argc, argv);		//starts up GLUT
	glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE);
	glutInitWindowSize(700,700);
	glutInitWindowPosition(0,0);
	glutCreateWindow("Assignment#1-Conway");	//creates the window
	gluOrtho2D(0,size-1,0,size-1); //for size * size grid. Index starts at 0.
	glutDisplayFunc(display);	//registers "display" as the display callback function
	glutKeyboardFunc(keyb);
	glutMouseFunc(mouse);
	glutTimerFunc(0, FPS, 0);
	glClearColor(1, 1, 1, 1);
	glutMainLoop();				//starts the event loop
	return(0);					//return may not be necessary on all compilers
}